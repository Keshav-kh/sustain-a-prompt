"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [continent, setContinent] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!continent) {
      toast.error("Please select your continent");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      email,
      name,
      password,
    });

    if (error?.code) {
      const map: Record<string, string> = {
        USER_ALREADY_EXISTS: "Email already registered",
      };
      toast.error(map[error.code] || "Registration failed");
      setLoading(false);
      return;
    }

    // Save continent to be persisted post-login
    if (typeof window !== "undefined") {
      localStorage.setItem("pending_continent", continent);
    }

    toast.success("Account created! Please login.");
    router.push("/login?registered=true");
    setLoading(false);
  };

  const handleAuth0 = async () => {
    setLoading(true);
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    if (inIframe) {
      toast.message("Auth0 can't open inside this preview", {
        description: "Open the app in a new tab/window and try again.",
      });
    }

    // Use a hard POST redirect via a temporary form to avoid method/redirect issues
    if (typeof window !== "undefined") {
      const callback = "/"; // change if you want a specific post-login page
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/api/auth/sign-in/social?provider=auth0&callbackURL=${encodeURIComponent(callback)}`;
      document.body.appendChild(form);
      try {
        form.submit();
        return;
      } catch (e) {
        // Fallback to top-level navigation (GET) if form submit fails
        const url = `/api/auth/sign-in/social?provider=auth0&callbackURL=${encodeURIComponent(callback)}`;
        try {
          if (window.top) window.top.location.href = url; else window.location.href = url;
          return;
        } catch {
          window.location.href = url;
          return;
        }
      } finally {
        // Clean up the form node if still present
        try { document.body.removeChild(form); } catch {}
      }
    }

    setLoading(false);
    toast.error("Auth0 sign-in couldn't start. Please try again in a new tab.");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center px-4">
      <div className="w-full max-w-md glass-strong rounded-2xl p-6 shadow-xl border border-border/50">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-full neon-glow-green glass" />
          <h1 className="mt-4 text-2xl font-semibold">Create your account</h1>
          <p className="text-muted-foreground text-sm">Join the Green AI revolution</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type="password" autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="continent">Continent</Label>
            <Select value={continent} onValueChange={setContinent}>
              <SelectTrigger id="continent">
                <SelectValue placeholder="Select your continent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa">Africa</SelectItem>
                <SelectItem value="Antarctica">Antarctica</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Oceania">Oceania</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <UserPlus className="w-4 h-4 mr-2" /> Register
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
          Already have an account? <button className="underline" onClick={() => router.push("/login")}>Login</button>
        </p>
      </div>
    </div>
  );
}