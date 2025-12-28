import DashboardHeader from "@/components/DashboardHeader";
import StatusBadge from "@/components/StatusBadge";
import { Download, Filter, RefreshCw } from "lucide-react";
interface LogEntry {
  id: string;
  time: string;
  level: "info" | "warn" | "error";
  message: string;
  source: string;
}
const logs: LogEntry[] = [{
  id: "1",
  time: "14:32:15.847",
  level: "info",
  message: "Webhook delivered successfully to Stripe Payments endpoint",
  source: "delivery"
}, {
  id: "2",
  time: "14:32:15.802",
  level: "info",
  message: "Processing payment.succeeded event",
  source: "processor"
}, {
  id: "3",
  time: "14:31:42.123",
  level: "info",
  message: "New user signup webhook triggered",
  source: "trigger"
}, {
  id: "4",
  time: "14:30:18.456",
  level: "error",
  message: "Connection timeout after 30000ms to Order Updates endpoint",
  source: "delivery"
}, {
  id: "5",
  time: "14:30:18.123",
  level: "warn",
  message: "Retry attempt 3/5 for event evt_3c4d5e6f7g",
  source: "retry"
}, {
  id: "6",
  time: "14:28:55.789",
  level: "info",
  message: "Inventory sync completed successfully",
  source: "delivery"
}, {
  id: "7",
  time: "14:27:33.456",
  level: "info",
  message: "Payment refund event queued for processing",
  source: "queue"
}, {
  id: "8",
  time: "14:26:12.123",
  level: "info",
  message: "Page view analytics event processed",
  source: "processor"
}, {
  id: "9",
  time: "14:25:01.789",
  level: "info",
  message: "Email notification sent successfully",
  source: "delivery"
}, {
  id: "10",
  time: "14:23:44.456",
  level: "error",
  message: "Invalid response from CRM Integration: 502 Bad Gateway",
  source: "delivery"
}, {
  id: "11",
  time: "14:23:43.123",
  level: "warn",
  message: "Slow response detected (2.1s) from CRM Integration",
  source: "monitor"
}, {
  id: "12",
  time: "14:22:19.789",
  level: "info",
  message: "Slack alert triggered successfully",
  source: "delivery"
}, {
  id: "13",
  time: "14:21:05.456",
  level: "info",
  message: "User verification webhook delivered",
  source: "delivery"
}, {
  id: "14",
  time: "14:20:33.123",
  level: "info",
  message: "System health check passed",
  source: "health"
}, {
  id: "15",
  time: "14:19:12.789",
  level: "warn",
  message: "High latency detected on analytics endpoint (>100ms)",
  source: "monitor"
}];
const levelIcons = {
  info: "text-info",
  warn: "text-warning",
  error: "text-error"
};
const Logs = () => {
  return <div className="animate-fade-in">
      <DashboardHeader title="Logs" subtitle="System logs and webhook delivery history" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search logs..." className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <select className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-muted-foreground">
              <option value="">All levels</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
            <select className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-muted-foreground">
              <option value="">All sources</option>
              <option value="delivery">Delivery</option>
              <option value="processor">Processor</option>
              <option value="trigger">Trigger</option>
              <option value="retry">Retry</option>
              <option value="monitor">Monitor</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
              Live
            </button>
            <button className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Logs list */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="bg-secondary/50 px-6 py-3 border-b border-border">
            <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-2">Time</div>
              <div className="col-span-1">Level</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-7">Message</div>
            </div>
          </div>
          <div className="divide-y divide-border font-mono text-sm">
            {logs.map(log => <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-secondary/30 transition-colors">
                <div className="col-span-2 text-muted-foreground tabular-nums">
                  {log.time}
                </div>
                <div className="col-span-1">
                  <StatusBadge status={log.level} />
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">
                    {log.source}
                  </span>
                </div>
                <div className={`col-span-7 ${levelIcons[log.level]}`}>
                  {log.message}
                </div>
              </div>)}
          </div>
        </div>

        {/* Load more */}
        <div className="flex justify-center">
          <button className="h-10 px-6 rounded-xl bg-secondary border border-border text-sm font-medium hover:bg-secondary/80 transition-colors text-muted-foreground">
            Load more logs
          </button>
        </div>
      </div>
    </div>;
};
export default Logs;