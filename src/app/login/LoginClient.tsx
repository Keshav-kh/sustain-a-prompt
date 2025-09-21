"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export const LoginClient = () => {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.get("registered") === "true") {
      toast.success("Account created! Please login.");
    }
  }, [search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/",
    });
    if (error?.code) {
      toast.error(
        "Invalid email or password. Please make sure you have already registered an account and try again."
      );
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleAuth0 = async () => {
    setLoading(true);
    const inIframe =
      typeof window !== "undefined" && window.self !== window.top;
    if (inIframe) {
      toast.message("Auth0 can't open inside this preview", {
        description: "Open the app in a new tab/window and try again.",
      });
    }

    const timeout = setTimeout(() => {
      setLoading(false);
      toast.error("Auth0 sign-in didn't complete.", {
        description: "Please open the app in a new tab and try again.",
      });
    }, 7000);

    const { error } = await authClient.signIn.social({
      provider: "auth0",
    });

    clearTimeout(timeout);
    if (error?.code) {
      toast.error("Auth0 sign-in failed");
      setLoading(false);
    }
    // On success, better-auth will handle redirect
  };

  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center px-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-6 shadow-xl border border-border/50">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full neon-glow-aqua glass" />
          <h1 className="mt-4 text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials or continue with Auth0
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(Boolean(v))}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </Label>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="w-4 h-4 mr-2" /> Log in
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button onClick={handleAuth0} className="w-full glass neon-glow-aqua" disabled={loading}>
          Continue with Auth0
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button className="underline" onClick={() => router.push("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};