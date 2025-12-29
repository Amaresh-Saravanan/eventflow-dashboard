import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { User, Bell, Key, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { apiKeys, loading: keysLoading, createApiKey, deleteApiKey } = useApiKeys();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [notifications, setNotifications] = useState({
    failedWebhook: true,
    weeklyDigest: true,
    securityAlerts: true,
  });

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [newlyCreatedKeys, setNewlyCreatedKeys] = useState<Record<string, string>>({});

  // Initialize form with profile data
  if (profile && !isInitialized) {
    setFullName(profile.full_name || "");
    setEmail(profile.email || "");
    setIsInitialized(true);
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

  const handleGenerateKey = async () => {
    const rawKey = await createApiKey(`API Key ${apiKeys.length + 1}`);
    if (rawKey) {
      // Store the raw key temporarily so user can copy it
      const keyId = apiKeys[0]?.id; // The newly created key will be at the start
      if (keyId) {
        setNewlyCreatedKeys(prev => ({ ...prev, [keyId]: rawKey }));
        setVisibleKeys(prev => ({ ...prev, [keyId]: true }));
      }
      toast({
        title: "API Key generated",
        description: "Your new API key has been created. Make sure to copy it now!",
      });
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    const success = await deleteApiKey(keyId);
    if (success) {
      setNewlyCreatedKeys(prev => {
        const updated = { ...prev };
        delete updated[keyId];
        return updated;
      });
      toast({
        title: "API Key revoked",
        description: "The API key has been permanently deleted",
      });
    }
  };

  const handleCopyKey = (keyId: string, keyPrefix: string) => {
    const fullKey = newlyCreatedKeys[keyId];
    if (fullKey) {
      navigator.clipboard.writeText(fullKey);
    } else {
      navigator.clipboard.writeText(keyPrefix + "...");
    }
    toast({
      title: "Copied to clipboard",
      description: fullKey ? "Full API key copied" : "Key prefix copied (full key only available immediately after creation)",
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (keyPrefix: string, keyId: string) => {
    const fullKey = newlyCreatedKeys[keyId];
    if (fullKey && visibleKeys[keyId]) {
      return fullKey;
    }
    return keyPrefix + "••••••••••••••••••••";
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await updateProfile({ full_name: fullName, email });
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const notificationItems = [
    { key: "failedWebhook" as const, label: "Failed webhook notifications", description: "Get notified when a webhook fails to deliver" },
    { key: "weeklyDigest" as const, label: "Weekly digest", description: "Receive a weekly summary of your webhook activity" },
    { key: "securityAlerts" as const, label: "Security alerts", description: "Important security-related notifications" },
  ];

  const loading = profileLoading || keysLoading;

  if (loading && !isInitialized) {
    return (
      <div className="animate-fade-in">
        <DashboardHeader title="Settings" subtitle="Manage your account and preferences" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys yet. Generate one to get started.
                </div>
              ) : (
                apiKeys.map(apiKey => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{apiKey.name}</p>
                      <code className="text-xs text-muted-foreground font-mono">
                        {visibleKeys[apiKey.id] ? maskKey(apiKey.key_prefix, apiKey.id) : apiKey.key_prefix + "••••••••••••"}
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
                        onClick={() => handleCopyKey(apiKey.id, apiKey.key_prefix)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        title="Copy key"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <span className="text-xs text-muted-foreground hidden sm:inline">{formatDate(apiKey.created_at)}</span>
                      <button
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSignOut}
              className="h-11 px-6 rounded-xl bg-secondary border border-border text-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="h-11 px-6 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
