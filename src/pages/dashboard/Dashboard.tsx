import { useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Activity, Webhook, CheckCircle, Clock, TrendingUp, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useEndpoints } from "@/hooks/useEndpoints";

const Dashboard = () => {
  const { events, loading: eventsLoading } = useEvents();
  const { endpoints, loading: endpointsLoading } = useEndpoints();

  const loading = eventsLoading || endpointsLoading;

  // Calculate stats
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const activeEndpoints = endpoints.filter(e => e.status === "active").length;
    const successfulEvents = events.filter(e => e.status === "success").length;
    const successRate = totalEvents > 0 ? Math.round((successfulEvents / totalEvents) * 100) : 0;
    const avgLatency = events.length > 0
      ? Math.round(events.filter(e => e.duration).reduce((acc, e) => acc + (e.duration || 0), 0) / events.filter(e => e.duration).length)
      : 0;

    return [
      {
        title: "Total Events",
        value: totalEvents.toLocaleString(),
        change: "",
        changeType: "neutral" as const,
        icon: Activity
      },
      {
        title: "Active Endpoints",
        value: activeEndpoints.toString(),
        change: "",
        changeType: "neutral" as const,
        icon: Webhook
      },
      {
        title: "Success Rate",
        value: `${successRate}%`,
        change: "",
        changeType: successRate >= 95 ? "positive" as const : successRate >= 80 ? "neutral" as const : "negative" as const,
        icon: CheckCircle
      },
      {
        title: "Avg. Latency",
        value: avgLatency ? `${avgLatency}ms` : "—",
        change: "",
        changeType: "neutral" as const,
        icon: Clock
      }
    ];
  }, [events, endpoints]);

  // Get recent events (last 5)
  const recentEvents = useMemo(() => {
    return events.slice(0, 5).map(event => ({
      id: event.event_id,
      endpoint: event.endpoint_name,
      status: event.status,
      time: new Date(event.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [events]);

  // Get top endpoints by event count
  const topEndpoints = useMemo(() => {
    return endpoints
      .sort((a, b) => b.events_count - a.events_count)
      .slice(0, 5)
      .map(endpoint => ({
        name: endpoint.name,
        events: endpoint.events_count.toLocaleString(),
        trend: "",
        status: endpoint.status === "active" ? "healthy" : "warning",
      }));
  }, [endpoints]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <DashboardHeader title="Dashboard" subtitle="Monitor your webhook activity and performance" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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
              <h3 className="text-lg font-semibold text-foreground">Recent Events</h3>
              <Link to="/dashboard/events" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events yet. Events will appear here when webhooks are triggered.
              </div>
            ) : (
              <div className="space-y-3">
                {recentEvents.map(event => (
                  <Link
                    key={event.id}
                    to={`/dashboard/events/${event.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{event.id}</p>
                        <p className="text-xs text-muted-foreground">{event.endpoint}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={event.status} />
                      <span className="text-xs text-muted-foreground w-20 text-right">{event.time}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Top Endpoints */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Top Endpoints</h3>
              <Link to="/dashboard/endpoints" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            {topEndpoints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No endpoints yet. Create one to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {topEndpoints.map((endpoint, index) => (
                  <div key={endpoint.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{endpoint.name}</p>
                        <p className="text-xs text-muted-foreground">{endpoint.events} events</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.status === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-success" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Event Activity</h3>
              <p className="text-sm text-muted-foreground">Events processed over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium text-foreground">7D</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">30D</button>
              <button className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">90D</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-xl">
            <div className="text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {events.length > 0 ? "Event activity visualization coming soon" : "Start receiving webhooks to see activity"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
