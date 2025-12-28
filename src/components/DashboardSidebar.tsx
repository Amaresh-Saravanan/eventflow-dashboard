import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Webhook, Activity, FileText, Settings, LogOut, Zap } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/endpoints", icon: Webhook, label: "Endpoints" },
  { to: "/dashboard/events", icon: Activity, label: "Events" },
  { to: "/dashboard/logs", icon: FileText, label: "Logs" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-[260px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">WebhookHub</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-item ${isActive(item.to) ? "sidebar-item-active" : ""}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link to="/dashboard/settings" className="sidebar-item">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <Link to="/" className="sidebar-item text-muted-foreground hover:text-error">
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
