import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-56px)] grid place-items-center px-4">
          <div className="text-muted-foreground">Loading…</div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}