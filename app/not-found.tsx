import Link from "next/link";
import { Home, Video } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-8xl font-display font-bold text-spyder-red opacity-20 mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-spyder-gray text-sm mb-8">
          This cam or page doesn&apos;t exist. Back to the lake?
        </p>
        <div className="flex flex-col xs:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link href="/#cams" className="btn-secondary">
            <Video className="w-4 h-4" />
            Browse Cams
          </Link>
        </div>
      </div>
    </div>
  );
}
