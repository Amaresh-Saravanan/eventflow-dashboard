import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Activity, Webhook, CheckCircle, Clock, TrendingUp, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
const stats = [{
  title: "Total Events",
  value: "—",
  change: "",
  changeType: "neutral" as const,
  icon: Activity
}, {
  title: "Active Endpoints",
  value: "—",
  change: "",
  changeType: "neutral" as const,
  icon: Webhook
}, {
  title: "Success Rate",
  value: "—",
  change: "",
  changeType: "neutral" as const,
  icon: CheckCircle
}, {
  title: "Avg. Latency",
  value: "—",
  change: "",
  changeType: "neutral" as const,
  icon: Clock
}];
const recentEvents: { id: string; endpoint: string; status: "success" | "failed" | "pending"; time: string }[] = [];
const topEndpoints: { name: string; events: string; trend: string; status: string }[] = [];
const Dashboard = () => {
  return <div className="animate-fade-in">
      <DashboardHeader title="Dashboard" subtitle="Monitor your webhook activity and performance" />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-destructive-foreground">Recent Events</h3>
              <Link to="/dashboard/events" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.map(event => <Link key={event.id} to={`/dashboard/events/${event.id}`} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground">{event.id}</p>
                      <p className="text-xs text-muted-foreground">{event.endpoint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={event.status} />
                    <span className="text-xs text-muted-foreground w-20 text-right">{event.time}</span>
                  </div>
                </Link>)}
            </div>
          </div>

          {/* Top Endpoints */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-foreground">Top Endpoints</h3>
              <Link to="/dashboard/endpoints" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {topEndpoints.map((endpoint, index) => <div key={endpoint.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{endpoint.name}</p>
                      <p className="text-xs text-muted-foreground">{endpoint.events} events</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${endpoint.trend.startsWith("+") ? "text-success" : "text-error"}`}>
                      {endpoint.trend}
                    </span>
                    {endpoint.status === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> : <TrendingUp className="w-4 h-4 text-success" />}
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">Event Activity</h3>
              <p className="text-sm text-muted-foreground">Events processed over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium">7D</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">30D</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">90D</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-xl">
            <div className="text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Event activity chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;