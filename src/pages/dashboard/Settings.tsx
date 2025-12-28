import DashboardHeader from "@/components/DashboardHeader";
import { User, Bell, Shield, Key, Globe, Palette } from "lucide-react";
const Settings = () => {
  return <div className="animate-fade-in">
      <DashboardHeader title="Settings" subtitle="Manage your account and preferences" />
      
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">Profile</h3>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Email</label>
                <input type="email" defaultValue="john@example.com" className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
              </div>
            </div>
            <div className="space-y-4">
              {[{
              label: "Failed webhook notifications",
              description: "Get notified when a webhook fails to deliver"
            }, {
              label: "Weekly digest",
              description: "Receive a weekly summary of your webhook activity"
            }, {
              label: "Security alerts",
              description: "Important security-related notifications"
            }].map(item => <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-primary relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary-foreground" />
                  </button>
                </div>)}
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground">API Keys</h3>
                  <p className="text-sm text-muted-foreground">Manage your API access credentials</p>
                </div>
              </div>
              <button className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium">
                Generate Key
              </button>
            </div>
            <div className="space-y-3">
              {[{
              name: "Production Key",
              key: "wh_live_••••••••••••abcd",
              created: "Dec 15, 2024"
            }, {
              name: "Development Key",
              key: "wh_test_••••••••••••efgh",
              created: "Dec 10, 2024"
            }].map(apiKey => <div key={apiKey.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">{apiKey.name}</p>
                    <code className="text-xs text-muted-foreground font-mono">{apiKey.key}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{apiKey.created}</span>
                    <button className="text-xs text-error hover:underline">Revoke</button>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button className="h-11 px-6 rounded-xl gradient-primary text-primary-foreground font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Settings;