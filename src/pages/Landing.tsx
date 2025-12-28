import { Link } from "react-router-dom";
import { Zap, ArrowRight, Check, Webhook, Activity, Shield, Gauge, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Webhook,
    title: "Webhook Management",
    description: "Create and manage unlimited webhook endpoints with custom configurations.",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Track all webhook events in real-time with detailed logs and metrics.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SSL encryption, signature verification, and IP whitelisting built-in.",
  },
  {
    icon: Gauge,
    title: "High Performance",
    description: "Handle millions of requests with sub-100ms latency worldwide.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed insights into webhook performance and delivery rates.",
  },
  {
    icon: Check,
    title: "Automatic Retries",
    description: "Smart retry logic ensures your webhooks are always delivered.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for side projects",
    features: ["5 endpoints", "10,000 events/month", "7-day log retention", "Community support"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams",
    features: ["Unlimited endpoints", "1M events/month", "30-day log retention", "Priority support", "Custom domains"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Unlimited everything", "99.99% SLA", "Dedicated support", "SSO & SAML", "Custom integrations"],
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">WebhookHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Now with 99.99% uptime guarantee
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
            Webhook infrastructure
            <br />
            <span className="text-muted-foreground">that just works</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            The modern webhook management platform for developers. Create, monitor, and debug
            webhooks with powerful tools and real-time insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="#"
              className="h-12 px-8 rounded-xl border border-border text-foreground font-medium flex items-center gap-2 hover:bg-secondary transition-colors"
            >
              View documentation
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free plan available
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl border border-border overflow-hidden shadow-elevated bg-card">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 pointer-events-none z-10" />
            <div className="p-4 sm:p-8 bg-[#16142B]">
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="bg-[#1E1B36] px-4 py-3 border-b border-border/50 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="bg-[#16142B] p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Total Events", value: "1.2M" },
                      { label: "Success Rate", value: "99.8%" },
                      { label: "Avg. Latency", value: "45ms" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#1E1B36] rounded-xl p-4 border border-[rgba(255,255,255,0.04)]">
                        <p className="text-xs text-[#A1A1AA] mb-1">{stat.label}</p>
                        <p className="text-2xl font-semibold text-[#FFFFFF]">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#1E1B36] rounded-xl p-4 border border-[rgba(255,255,255,0.04)] h-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage webhooks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers who need reliable, scalable webhook infrastructure without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl border ${
                  plan.popular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block w-full py-2.5 rounded-lg text-center text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl gradient-accent">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-accent-foreground/80 mb-8">
              Join thousands of developers who trust WebhookHub for their webhook infrastructure.
            </p>
            <Link
              to="/login"
              className="inline-flex h-12 px-8 rounded-xl bg-primary text-primary-foreground font-medium items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Start building today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">WebhookHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 WebhookHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
