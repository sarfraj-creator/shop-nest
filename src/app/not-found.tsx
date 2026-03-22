import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <p className="text-7xl font-extrabold text-indigo-100">404</p>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  );
}
