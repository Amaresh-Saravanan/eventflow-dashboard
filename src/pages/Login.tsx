import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useEffect } from "react";
import { SignIn, useUser } from "@clerk/clerk-react";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      navigate("/dashboard");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen auth-theme bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary-foreground">WebhookHub</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Webhook infrastructure
            <br />
            that scales with you
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Join thousands of developers who trust WebhookHub for reliable, 
            real-time webhook management.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2024 WebhookHub. All rights reserved.
        </p>
      </div>

      {/* Right side - Clerk SignIn */}
      <div className="flex-1 flex items-center justify-center p-8">
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

          <div className="flex justify-center">
            <SignIn 
              routing="hash"
              signUpUrl="/login"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-card border border-border shadow-elevated rounded-2xl",
                  headerTitle: "text-foreground",
                  headerSubtitle: "text-muted-foreground",
                  socialButtonsBlockButton: "bg-card border border-border text-foreground hover:bg-muted",
                  socialButtonsBlockButtonText: "text-foreground font-medium",
                  dividerLine: "bg-border",
                  dividerText: "text-muted-foreground",
                  formFieldLabel: "text-foreground",
                  formFieldInput: "bg-input border-border text-foreground rounded-xl",
                  formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90 rounded-xl",
                  footerActionLink: "text-primary hover:text-primary/80",
                  identityPreviewText: "text-foreground",
                  identityPreviewEditButton: "text-primary",
                  formFieldAction: "text-primary",
                  alert: "bg-destructive/10 border-destructive text-destructive",
                }
              }}
            />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
