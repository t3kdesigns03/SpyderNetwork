// Netlify Scheduled Function — offline-alert trigger.
// Runs every 15 minutes and pings the Next.js cron route, which does the actual
// status check + alerting. Kept tiny and dependency-free on purpose.

export const config = { schedule: "*/15 * * * *" };

export default async () => {
  const base =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "https://beta.spydernetwork.com";

  try {
    const res = await fetch(`${base}/api/cron/offline-check`, {
      method: "POST",
      headers: { "x-cron-secret": process.env.CRON_SECRET || "" },
    });
    return new Response(`offline-check triggered: ${res.status}`, { status: 200 });
  } catch (err) {
    return new Response(`offline-check trigger failed: ${err}`, { status: 500 });
  }
};
