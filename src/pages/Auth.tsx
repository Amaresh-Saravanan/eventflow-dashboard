import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const emailSchema = z.string().email("Enter a valid email");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

const Auth = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpFullName, setSignUpFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const redirectTo = useMemo(() => `${window.location.origin}/dashboard`, []);

  const validate = (email: string, password: string) => {
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success) return emailResult.error.issues[0]?.message ?? "Invalid email";
    if (!passwordResult.success) return passwordResult.error.issues[0]?.message ?? "Invalid password";
    return null;
  };

  const ensureProfile = async (userId: string, email: string, fullName?: string) => {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email,
        full_name: fullName?.trim() ? fullName.trim() : null,
      });

    if (error) {
      // non-fatal
      console.error("Profile upsert failed:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(signInEmail, signInPassword);
    if (msg) {
      toast({ title: "Check your details", description: msg, variant: "destructive" });
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInEmail.trim(),
      password: signInPassword,
    });
    setBusy(false);

    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }

    if (data.user?.id) {
      await ensureProfile(data.user.id, signInEmail.trim());
    }

    toast({ title: "Welcome back", description: "You are signed in." });
    navigate("/dashboard", { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(signUpEmail, signUpPassword);
    if (msg) {
      toast({ title: "Check your details", description: msg, variant: "destructive" });
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail.trim(),
      password: signUpPassword,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: signUpFullName.trim() || undefined,
        },
      },
    });
    setBusy(false);

    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }

    if (data.user?.id) {
      await ensureProfile(data.user.id, signUpEmail.trim(), signUpFullName);
    }

    toast({
      title: "Account created",
      description: "You're signed in and ready to go.",
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="min-h-screen auth-theme bg-background flex">
      {/* Left side - Branding */}
      <aside className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary-foreground">WebhookHub</span>
        </Link>

        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Sign in to manage your webhooks
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Create endpoints, inspect events, and troubleshoot deliveries in one place.
          </p>
        </section>

        <p className="text-sm text-primary-foreground/60">© 2025 WebhookHub. All rights reserved.</p>
      </aside>

      {/* Right side - Auth */}
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">WebhookHub</span>
            </Link>
          </div>

          <Card className="p-6 rounded-2xl">
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      autoComplete="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      autoComplete="current-password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    New here?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setTab("signup")}
                    >
                      Create an account
                    </button>
                    .
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name (optional)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Creating…" : "Create account"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setTab("signin")}
                    >
                      Sign in
                    </button>
                    .
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Auth;
