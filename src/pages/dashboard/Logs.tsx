import { useState, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatusBadge from "@/components/StatusBadge";
import { Download, Filter, RefreshCw, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  time: string;
  level: "info" | "warn" | "error";
  message: string;
  source: string;
}

const allLogs: LogEntry[] = [
  { id: "1", time: "14:32:15.847", level: "info", message: "Webhook delivered successfully to Stripe Payments endpoint", source: "delivery" },
  { id: "2", time: "14:32:15.802", level: "info", message: "Processing payment.succeeded event", source: "processor" },
  { id: "3", time: "14:31:42.123", level: "info", message: "New user signup webhook triggered", source: "trigger" },
  { id: "4", time: "14:30:18.456", level: "error", message: "Connection timeout after 30000ms to Order Updates endpoint", source: "delivery" },
  { id: "5", time: "14:30:18.123", level: "warn", message: "Retry attempt 3/5 for event evt_3c4d5e6f7g", source: "retry" },
  { id: "6", time: "14:28:55.789", level: "info", message: "Inventory sync completed successfully", source: "delivery" },
  { id: "7", time: "14:27:33.456", level: "info", message: "Payment refund event queued for processing", source: "queue" },
  { id: "8", time: "14:26:12.123", level: "info", message: "Page view analytics event processed", source: "processor" },
  { id: "9", time: "14:25:01.789", level: "info", message: "Email notification sent successfully", source: "delivery" },
  { id: "10", time: "14:23:44.456", level: "error", message: "Invalid response from CRM Integration: 502 Bad Gateway", source: "delivery" },
  { id: "11", time: "14:23:43.123", level: "warn", message: "Slow response detected (2.1s) from CRM Integration", source: "monitor" },
  { id: "12", time: "14:22:19.789", level: "info", message: "Slack alert triggered successfully", source: "delivery" },
  { id: "13", time: "14:21:05.456", level: "info", message: "User verification webhook delivered", source: "delivery" },
  { id: "14", time: "14:20:33.123", level: "info", message: "System health check passed", source: "health" },
  { id: "15", time: "14:19:12.789", level: "warn", message: "High latency detected on analytics endpoint (>100ms)", source: "monitor" },
  { id: "16", time: "14:18:05.456", level: "info", message: "Database backup completed", source: "system" },
  { id: "17", time: "14:17:33.123", level: "error", message: "Failed to connect to external API", source: "delivery" },
  { id: "18", time: "14:16:22.789", level: "info", message: "Cache cleared successfully", source: "system" },
  { id: "19", time: "14:15:11.456", level: "warn", message: "Rate limit approaching for API endpoint", source: "monitor" },
  { id: "20", time: "14:14:00.123", level: "info", message: "New endpoint configuration saved", source: "system" },
];

const levelIcons = {
  info: "text-info",
  warn: "text-warning",
  error: "text-error"
};

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const matchesSearch = searchQuery === "" || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === "" || log.level === levelFilter;
      const matchesSource = sourceFilter === "" || log.source === sourceFilter;
      return matchesSearch && matchesLevel && matchesSource;
    });
  }, [searchQuery, levelFilter, sourceFilter]);

  const visibleLogs = filteredLogs.slice(0, visibleCount);

  const handleLiveToggle = () => {
    setIsLive(!isLive);
    toast({
      title: isLive ? "Live mode disabled" : "Live mode enabled",
      description: isLive ? "Log updates paused" : "Logs will auto-refresh every 5 seconds",
    });
  };

  const handleExport = () => {
    const csvContent = [
      ["Time", "Level", "Source", "Message"].join(","),
      ...filteredLogs.map(log => [log.time, log.level, log.source, `"${log.message}"`].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs exported",
      description: `${filteredLogs.length} log entries exported to CSV`,
    });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, filteredLogs.length));
    toast({
      title: "More logs loaded",
      description: `Showing ${Math.min(visibleCount + 10, filteredLogs.length)} of ${filteredLogs.length} logs`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter("");
    setSourceFilter("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchQuery || levelFilter || sourceFilter;

  return (
    <div className="animate-fade-in">
      <DashboardHeader title="Logs" subtitle="System logs and webhook delivery history" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-foreground"
            >
              <option value="">All levels</option>
              <option value="info">Info</option>
              <option value="warn">Warning</option>
              <option value="error">Error</option>
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-foreground"
            >
              <option value="">All sources</option>
              <option value="delivery">Delivery</option>
              <option value="processor">Processor</option>
              <option value="trigger">Trigger</option>
              <option value="retry">Retry</option>
              <option value="monitor">Monitor</option>
              <option value="queue">Queue</option>
              <option value="health">Health</option>
              <option value="system">System</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-10 px-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm font-medium flex items-center gap-2 hover:bg-destructive/20 transition-colors text-destructive"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLiveToggle}
              className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                isLive 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary border-border text-foreground hover:bg-secondary/80"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} />
              {isLive ? "Live" : "Live"}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary border-border text-foreground hover:bg-secondary/80"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={handleExport}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-foreground"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filter info */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {allLogs.length} logs
          </div>
        )}

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
            {visibleLogs.length > 0 ? (
              visibleLogs.map(log => (
                <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-secondary/30 transition-colors">
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
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No logs found matching your filters
              </div>
            )}
          </div>
        </div>

        {/* Load more */}
        {visibleCount < filteredLogs.length && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="h-10 px-6 rounded-xl bg-secondary border border-border text-sm font-medium hover:bg-secondary/80 transition-colors text-foreground"
            >
              Load more logs ({filteredLogs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
