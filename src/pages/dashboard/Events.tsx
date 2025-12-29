import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Filter, Download, X, Activity } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEvents, Event } from "@/hooks/useEvents";
import { useEndpoints } from "@/hooks/useEndpoints";

const Events = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { endpoints } = useEndpoints();
  const [searchQuery, setSearchQuery] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchQuery === "" ||
        event.event_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.endpoint_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEndpoint = endpointFilter === "" || event.endpoint_name.toLowerCase().includes(endpointFilter.toLowerCase());
      const matchesStatus = statusFilter === "" || event.status === statusFilter;
      return matchesSearch && matchesEndpoint && matchesStatus;
    });
  }, [events, searchQuery, endpointFilter, statusFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowClick = (event: Event) => {
    navigate(`/dashboard/events/${event.event_id}`);
  };

  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "-";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const handleExport = () => {
    const csvContent = [
      ["Event ID", "Endpoint", "Event Type", "Status", "Duration", "Timestamp"].join(","),
      ...filteredEvents.map(e => [
        e.event_id,
        e.endpoint_name,
        e.event_type,
        e.status,
        formatDuration(e.duration),
        formatTimestamp(e.created_at)
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Events exported",
      description: `${filteredEvents.length} events exported to CSV`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEndpointFilter("");
    setStatusFilter("");
    setShowMoreFilters(false);
  };

  const hasActiveFilters = searchQuery || endpointFilter || statusFilter;

  const columns = [
    {
      key: "event_id" as const,
      header: "Event ID",
      render: (item: Event) => <code className="text-xs bg-secondary px-2 py-1 rounded-md font-mono text-foreground">{item.event_id}</code>
    },
    {
      key: "endpoint_name" as const,
      header: "Endpoint",
      render: (item: Event) => <span className="font-medium text-sm text-foreground">{item.endpoint_name}</span>
    },
    {
      key: "event_type" as const,
      header: "Event Type",
      render: (item: Event) => <code className="text-xs text-muted-foreground font-mono">{item.event_type}</code>,
      className: "hidden md:table-cell"
    },
    {
      key: "status" as const,
      header: "Status",
      render: (item: Event) => <StatusBadge status={item.status} />
    },
    {
      key: "duration" as const,
      header: "Duration",
      render: (item: Event) => <span className="text-muted-foreground">{formatDuration(item.duration)}</span>,
      className: "hidden sm:table-cell"
    },
    {
      key: "created_at" as const,
      header: "Timestamp",
      render: (item: Event) => <span className="text-sm text-muted-foreground tabular-nums">{formatTimestamp(item.created_at)}</span>,
      className: "hidden lg:table-cell"
    }
  ];

  // Get unique endpoint names for filter dropdown
  const uniqueEndpoints = [...new Set(endpoints.map(e => e.name))];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <DashboardHeader title="Events" subtitle="View all webhook events and their delivery status" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <DashboardHeader title="Events" subtitle="View all webhook events and their delivery status" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={endpointFilter}
              onChange={(e) => setEndpointFilter(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-foreground"
            >
              <option value="">All endpoints</option>
              {uniqueEndpoints.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-foreground"
            >
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
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
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                showMoreFilters 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-secondary border-border text-foreground hover:bg-secondary/80"
              }`}
            >
              <Filter className="w-4 h-4" />
              More Filters
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
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}

        {/* Empty state */}
        {events.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground">Events will appear here when webhooks are triggered</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <Table columns={columns} data={paginatedEvents} onRowClick={handleRowClick} />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredEvents.length)}</span> of <span className="font-medium">{filteredEvents.length}</span> events
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-foreground"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-muted-foreground">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium ${
                          currentPage === totalPages
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-foreground"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;
