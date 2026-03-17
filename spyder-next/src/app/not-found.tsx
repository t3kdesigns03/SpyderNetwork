import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground mt-2">Page not found</p>
      <Link href="/">
        <Button className="mt-6">Back to Live Cams</Button>
      </Link>
    </div>
  );
}
