import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Activity, Webhook, CheckCircle, Clock, TrendingUp, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
const stats = [{
  title: "Total Events",
  value: "1,247,893",
  change: "+12.5% from last month",
  changeType: "positive" as const,
  icon: Activity
}, {
  title: "Active Endpoints",
  value: "24",
  change: "3 added this week",
  changeType: "neutral" as const,
  icon: Webhook
}, {
  title: "Success Rate",
  value: "99.8%",
  change: "+0.3% from last week",
  changeType: "positive" as const,
  icon: CheckCircle
}, {
  title: "Avg. Latency",
  value: "45ms",
  change: "-5ms improvement",
  changeType: "positive" as const,
  icon: Clock
}];
const recentEvents = [{
  id: "evt_1a2b3c",
  endpoint: "Stripe Payments",
  status: "success" as const,
  time: "2 min ago"
}, {
  id: "evt_4d5e6f",
  endpoint: "User Signups",
  status: "success" as const,
  time: "5 min ago"
}, {
  id: "evt_7g8h9i",
  endpoint: "Order Updates",
  status: "failed" as const,
  time: "12 min ago"
}, {
  id: "evt_0j1k2l",
  endpoint: "Inventory Sync",
  status: "success" as const,
  time: "18 min ago"
}, {
  id: "evt_3m4n5o",
  endpoint: "Stripe Payments",
  status: "pending" as const,
  time: "23 min ago"
}];
const topEndpoints = [{
  name: "Stripe Payments",
  events: "45,231",
  trend: "+8%",
  status: "healthy"
}, {
  name: "User Signups",
  events: "23,845",
  trend: "+15%",
  status: "healthy"
}, {
  name: "Order Updates",
  events: "18,392",
  trend: "-2%",
  status: "warning"
}, {
  name: "Inventory Sync",
  events: "12,456",
  trend: "+5%",
  status: "healthy"
}];
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