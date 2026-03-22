"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
        😕
      </div>
      <h2 className="text-xl font-bold text-slate-900">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-500">
        We couldn&apos;t load the products. This might be a temporary issue.
      </p>
      <Button onClick={reset} size="lg">
        Try Again
      </Button>
    </div>
  );
}
