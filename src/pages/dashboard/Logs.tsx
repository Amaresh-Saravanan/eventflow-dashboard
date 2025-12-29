import { useState, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatusBadge from "@/components/StatusBadge";
import { Download, Filter, RefreshCw, X, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLogs, LogEntry } from "@/hooks/useLogs";

const levelIcons = {
  info: "text-info",
  warn: "text-warning",
  error: "text-error"
};

const Logs = () => {
  const { logs, loading, refetch } = useLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchQuery === "" || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = levelFilter === "" || log.level === levelFilter;
      const matchesSource = sourceFilter === "" || log.source === sourceFilter;
      return matchesSearch && matchesLevel && matchesSource;
    });
  }, [logs, searchQuery, levelFilter, sourceFilter]);

  const visibleLogs = filteredLogs.slice(0, visibleCount);

  // Get unique sources for filter dropdown
  const uniqueSources = [...new Set(logs.map(l => l.source))];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + "." + date.getMilliseconds().toString().padStart(3, "0");
  };

  const handleLiveToggle = () => {
    setIsLive(!isLive);
    if (!isLive) {
      refetch();
    }
    toast({
      title: isLive ? "Live mode disabled" : "Live mode enabled",
      description: isLive ? "Log updates paused" : "Logs will auto-refresh",
    });
  };

  const handleExport = () => {
    const csvContent = [
      ["Time", "Level", "Source", "Message"].join(","),
      ...filteredLogs.map(log => [formatTime(log.created_at), log.level, log.source, `"${log.message}"`].join(","))
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
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLevelFilter("");
    setSourceFilter("");
    setShowFilters(false);
  };

  const hasActiveFilters = searchQuery || levelFilter || sourceFilter;

  if (loading) {
    return (
      <div className="animate-fade-in">
        <DashboardHeader title="Logs" subtitle="System logs and webhook delivery history" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
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
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        )}

        {/* Empty state */}
        {logs.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No logs yet</h3>
            <p className="text-muted-foreground">Logs will appear here when webhook activity occurs</p>
          </div>
        ) : (
          <>
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
                        {formatTime(log.created_at)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Logs;
