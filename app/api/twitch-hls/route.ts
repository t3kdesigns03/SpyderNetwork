import { NextResponse } from "next/server";

/**
 * GET /api/twitch-hls?channel=<login>
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side resolver that turns a Twitch channel login into a directly
 * playable HLS master-playlist URL, so the cam can be played in a native
 * <video> (via HlsPlayer) and therefore muted-autoplay reliably — the same way
 * the /hls-demo page does — instead of Twitch's iframe (whose autoplay we can't
 * control).
 *
 * HOW IT WORKS
 *   1. Ask Twitch's GraphQL endpoint for a stream PlaybackAccessToken. This MUST
 *      be done server-side: the browser can't call gql.twitch.tv cross-origin
 *      (CORS), which is the whole reason this route exists.
 *   2. Hand that token/signature to usher.ttvnw.net to get the master .m3u8.
 *      The usher playlist and the segment CDNs (*.ttvnw.net) DO send permissive
 *      CORS headers, so the browser's hls.js can load them directly once it has
 *      the URL.
 *   3. Return { url } for the client to feed to HlsPlayer.
 *
 * IMPORTANT CAVEATS (see CamPlayer.tsx, which falls back to the Twitch iframe):
 *   • This uses Twitch's private/undocumented API and is against Twitch's Terms
 *     of Service. It can break with no notice if Twitch changes the flow or adds
 *     integrity checks. Requested explicitly for SpyderNetwork's own channels.
 *   • Tokens are short-lived — the client refetches on playback error.
 *   • Twitch may splice ads into the source; unmonetised cam channels usually
 *     have none, but that's outside our control.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public Twitch web client-id (the same one twitch.tv's own web player sends).
const CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

// Full GraphQL query (not a persisted-query hash, which goes stale) requesting a
// live stream playback access token.
const GQL_QUERY = `query PlaybackAccessToken_Template($login: String!, $isLive: Boolean!, $vodID: ID!, $isVod: Boolean!, $playerType: String!) {
  streamPlaybackAccessToken(channelName: $login, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isLive) { value signature __typename }
  videoPlaybackAccessToken(id: $vodID, params: {platform: "web", playerBackend: "mediaplayer", playerType: $playerType}) @include(if: $isVod) { value signature __typename }
}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Sanitise: Twitch logins are [a-z0-9_] only.
  const channel = (searchParams.get("channel") ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  if (!channel) {
    return NextResponse.json({ error: "missing or invalid channel" }, { status: 400 });
  }

  try {
    // ── 1) PlaybackAccessToken ────────────────────────────────────────────────
    const tokenRes = await fetch("https://gql.twitch.tv/gql", {
      method: "POST",
      headers: {
        "Client-ID": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "PlaybackAccessToken_Template",
        query: GQL_QUERY,
        variables: {
          isLive: true,
          login: channel,
          isVod: false,
          vodID: "",
          playerType: "site",
        },
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: "twitch gql request failed", status: tokenRes.status },
        { status: 502 }
      );
    }

    const tokenJson = (await tokenRes.json()) as {
      data?: { streamPlaybackAccessToken?: { value?: string; signature?: string } };
    };
    const token = tokenJson?.data?.streamPlaybackAccessToken;

    if (!token?.value || !token?.signature) {
      // No token usually means the channel is offline or does not exist.
      return NextResponse.json(
        { error: "no playback token (channel offline or unavailable)" },
        { status: 404 }
      );
    }

    // ── 2) usher master playlist URL ──────────────────────────────────────────
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      token: token.value,
      sig: token.signature,
      allow_source: "true",
      allow_audio_only: "true",
      fast_bread: "true",
      player: "twitchweb",
      type: "any",
      p: String(Math.floor(Math.random() * 1_000_000)),
    });
    const url = `https://usher.ttvnw.net/api/channel/hls/${channel}.m3u8?${params.toString()}`;

    // Client loads this directly with hls.js. Never cache — tokens expire.
    return NextResponse.json(
      { url },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "resolver exception", detail: String(err) },
      { status: 500 }
    );
  }
}
