import { Bell, Search, ChevronDown } from "lucide-react";
interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}
const DashboardHeader = ({
  title,
  subtitle
}: DashboardHeaderProps) => {
  return <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Title */}
        <div>
          <h1 className="text-xl font-semibold text-secondary-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search..." className="w-64 h-9 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* User menu */}
          <button className="flex items-center gap-3 p-1.5 pr-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
              JD
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-muted-foreground">John Doe</p>
              
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>
        </div>
      </div>
    </header>;
};
export default DashboardHeader;