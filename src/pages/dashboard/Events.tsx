import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Filter, Download, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  eventId: string;
  endpoint: string;
  eventType: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  duration: string;
}

const allEvents: Event[] = [
  { id: "1", eventId: "evt_1a2b3c4d5e", endpoint: "Stripe Payments", eventType: "payment.succeeded", status: "success", timestamp: "Dec 28, 2024 14:32:15", duration: "45ms" },
  { id: "2", eventId: "evt_2b3c4d5e6f", endpoint: "User Signups", eventType: "user.created", status: "success", timestamp: "Dec 28, 2024 14:31:42", duration: "32ms" },
  { id: "3", eventId: "evt_3c4d5e6f7g", endpoint: "Order Updates", eventType: "order.updated", status: "failed", timestamp: "Dec 28, 2024 14:30:18", duration: "1.2s" },
  { id: "4", eventId: "evt_4d5e6f7g8h", endpoint: "Inventory Sync", eventType: "inventory.changed", status: "success", timestamp: "Dec 28, 2024 14:28:55", duration: "67ms" },
  { id: "5", eventId: "evt_5e6f7g8h9i", endpoint: "Stripe Payments", eventType: "payment.refunded", status: "pending", timestamp: "Dec 28, 2024 14:27:33", duration: "-" },
  { id: "6", eventId: "evt_6f7g8h9i0j", endpoint: "Analytics Events", eventType: "page.viewed", status: "success", timestamp: "Dec 28, 2024 14:26:12", duration: "28ms" },
  { id: "7", eventId: "evt_7g8h9i0j1k", endpoint: "Email Notifications", eventType: "email.sent", status: "success", timestamp: "Dec 28, 2024 14:25:01", duration: "156ms" },
  { id: "8", eventId: "evt_8h9i0j1k2l", endpoint: "CRM Integration", eventType: "contact.updated", status: "failed", timestamp: "Dec 28, 2024 14:23:44", duration: "2.1s" },
  { id: "9", eventId: "evt_9i0j1k2l3m", endpoint: "Slack Alerts", eventType: "alert.triggered", status: "success", timestamp: "Dec 28, 2024 14:22:19", duration: "89ms" },
  { id: "10", eventId: "evt_0j1k2l3m4n", endpoint: "User Signups", eventType: "user.verified", status: "success", timestamp: "Dec 28, 2024 14:21:05", duration: "41ms" },
  { id: "11", eventId: "evt_1k2l3m4n5o", endpoint: "Stripe Payments", eventType: "payment.failed", status: "failed", timestamp: "Dec 28, 2024 14:20:00", duration: "234ms" },
  { id: "12", eventId: "evt_2l3m4n5o6p", endpoint: "Order Updates", eventType: "order.shipped", status: "success", timestamp: "Dec 28, 2024 14:18:30", duration: "52ms" },
];

const columns = [
  {
    key: "eventId" as keyof Event,
    header: "Event ID",
    render: (item: Event) => <code className="text-xs bg-secondary px-2 py-1 rounded-md font-mono text-foreground">{item.eventId}</code>
  },
  {
    key: "endpoint" as keyof Event,
    header: "Endpoint",
    render: (item: Event) => <span className="font-medium text-sm text-foreground">{item.endpoint}</span>
  },
  {
    key: "eventType" as keyof Event,
    header: "Event Type",
    render: (item: Event) => <code className="text-xs text-muted-foreground font-mono">{item.eventType}</code>,
    className: "hidden md:table-cell"
  },
  {
    key: "status" as keyof Event,
    header: "Status",
    render: (item: Event) => <StatusBadge status={item.status} />
  },
  {
    key: "duration" as keyof Event,
    header: "Duration",
    render: (item: Event) => <span className="text-muted-foreground">{item.duration}</span>,
    className: "hidden sm:table-cell"
  },
  {
    key: "timestamp" as keyof Event,
    header: "Timestamp",
    render: (item: Event) => <span className="text-sm text-muted-foreground tabular-nums">{item.timestamp}</span>,
    className: "hidden lg:table-cell"
  }
];

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = searchQuery === "" ||
        event.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEndpoint = endpointFilter === "" || event.endpoint.toLowerCase().includes(endpointFilter.toLowerCase());
      const matchesStatus = statusFilter === "" || event.status === statusFilter;
      return matchesSearch && matchesEndpoint && matchesStatus;
    });
  }, [searchQuery, endpointFilter, statusFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRowClick = (event: Event) => {
    navigate(`/dashboard/events/${event.eventId}`);
  };

  const handleExport = () => {
    const csvContent = [
      ["Event ID", "Endpoint", "Event Type", "Status", "Duration", "Timestamp"].join(","),
      ...filteredEvents.map(e => [e.eventId, e.endpoint, e.eventType, e.status, e.duration, e.timestamp].join(","))
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
              <option value="stripe">Stripe Payments</option>
              <option value="users">User Signups</option>
              <option value="orders">Order Updates</option>
              <option value="inventory">Inventory Sync</option>
              <option value="analytics">Analytics Events</option>
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
            Showing {filteredEvents.length} of {allEvents.length} events
          </div>
        )}

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
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-foreground"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
