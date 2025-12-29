import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { User, Bell, Key, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}

const Settings = () => {
  const { user, updateUser } = useUser();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  
  const [notifications, setNotifications] = useState({
    failedWebhook: true,
    weeklyDigest: true,
    securityAlerts: true,
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: "1", name: "Production Key", key: "wh_live_" + generateRandomKey(), created: "Dec 15, 2024" },
    { id: "2", name: "Development Key", key: "wh_test_" + generateRandomKey(), created: "Dec 10, 2024" },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  function generateRandomKey(): string {
    return Array.from({ length: 24 }, () => 
      "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
    ).join("");
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const newValue = !prev[key];
      toast({
        title: newValue ? "Notification enabled" : "Notification disabled",
        description: `${key === "failedWebhook" ? "Failed webhook" : key === "weeklyDigest" ? "Weekly digest" : "Security alerts"} notifications ${newValue ? "enabled" : "disabled"}`,
      });
      return { ...prev, [key]: newValue };
    });
  };

  const handleGenerateKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: "wh_live_" + generateRandomKey(),
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setApiKeys(prev => [...prev, newKey]);
    setVisibleKeys(prev => ({ ...prev, [newKey.id]: true }));
    toast({
      title: "API Key generated",
      description: "Your new API key has been created. Make sure to copy it now!",
    });
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
    toast({
      title: "API Key revoked",
      description: "The API key has been permanently deleted",
      variant: "destructive",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "API key copied successfully",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "••••••••••••" + key.substring(key.length - 4);
  };

  const handleSaveChanges = () => {
    updateUser({ fullName, email });
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully",
    });
  };

  const notificationItems = [
    { key: "failedWebhook" as const, label: "Failed webhook notifications", description: "Get notified when a webhook fails to deliver" },
    { key: "weeklyDigest" as const, label: "Weekly digest", description: "Receive a weekly summary of your webhook activity" },
    { key: "securityAlerts" as const, label: "Security alerts", description: "Important security-related notifications" },
  ];

  return (
    <div className="animate-fade-in">
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
                <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                <p className="text-sm text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
                <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
              </div>
            </div>
            <div className="space-y-4">
              {notificationItems.map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(item.key)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      notifications[item.key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-primary-foreground transition-all ${
                        notifications[item.key] ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
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
                  <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
                  <p className="text-sm text-muted-foreground">Manage your API access credentials</p>
                </div>
              </div>
              <button
                onClick={handleGenerateKey}
                className="h-9 px-4 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Generate Key
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.map(apiKey => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{apiKey.name}</p>
                    <code className="text-xs text-muted-foreground font-mono">
                      {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      title={visibleKeys[apiKey.id] ? "Hide key" : "Show key"}
                    >
                      {visibleKeys[apiKey.id] ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      title="Copy key"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <span className="text-xs text-muted-foreground hidden sm:inline">{apiKey.created}</span>
                    <button
                      onClick={() => handleRevokeKey(apiKey.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="h-11 px-6 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
