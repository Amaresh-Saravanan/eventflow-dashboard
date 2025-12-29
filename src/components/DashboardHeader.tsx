import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: "Webhook failed", message: "Order Updates endpoint returned 500", time: "5m ago", unread: true },
    { id: 2, title: "New endpoint created", message: "Analytics Events is now active", time: "1h ago", unread: true },
    { id: 3, title: "Rate limit warning", message: "Stripe Payments approaching limit", time: "2h ago", unread: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for "${searchQuery}"...`,
      });
    }
  };

  const handleNotificationClick = (id: number) => {
    toast({
      title: "Notification viewed",
      description: "Opening notification details...",
    });
    setShowNotifications(false);
  };

  const handleUserMenuAction = async (action: string) => {
    if (action === "Sign out") {
      await signOut();
      toast({ title: "Signed out", description: "You have been signed out successfully" });
      navigate("/", { replace: true });
      return;
    }

    toast({
      title: action,
      description: `${action} action triggered`,
    });
    setShowUserMenu(false);
  };


  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-9 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </form>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded hover:bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors border-b border-border last:border-0 ${
                        notif.unread ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        )}
                        <div className={notif.unread ? "" : "ml-5"}>
                          <p className="font-medium text-sm text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button
                    onClick={() => {
                      toast({ title: "View all notifications", description: "Opening notifications page..." });
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-sm text-primary hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                {user.initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{user.fullName}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground hidden md:block transition-transform ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={() => handleUserMenuAction("Profile")}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleUserMenuAction("Settings")}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleUserMenuAction("Billing")}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    Billing
                  </button>
                  <div className="border-t border-border my-1" />
                  <button
                    onClick={() => handleUserMenuAction("Sign out")}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-secondary rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
