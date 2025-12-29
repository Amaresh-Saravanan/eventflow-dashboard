import { useState, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Plus, MoreVertical, Copy, ExternalLink, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Endpoint {
  id: string;
  name: string;
  url: string;
  status: "active" | "inactive";
  createdAt: string;
  eventsToday: number;
}

const initialEndpoints: Endpoint[] = [
  { id: "ep_001", name: "Stripe Payments", url: "https://api.example.com/webhooks/stripe", status: "active", createdAt: "Dec 15, 2024", eventsToday: 1247 },
  { id: "ep_002", name: "User Signups", url: "https://api.example.com/webhooks/users", status: "active", createdAt: "Dec 10, 2024", eventsToday: 892 },
  { id: "ep_003", name: "Order Updates", url: "https://api.example.com/webhooks/orders", status: "inactive", createdAt: "Dec 5, 2024", eventsToday: 0 },
  { id: "ep_004", name: "Inventory Sync", url: "https://api.example.com/webhooks/inventory", status: "active", createdAt: "Nov 28, 2024", eventsToday: 456 },
  { id: "ep_005", name: "Analytics Events", url: "https://api.example.com/webhooks/analytics", status: "active", createdAt: "Nov 20, 2024", eventsToday: 2341 },
  { id: "ep_006", name: "Email Notifications", url: "https://api.example.com/webhooks/email", status: "active", createdAt: "Nov 15, 2024", eventsToday: 187 },
  { id: "ep_007", name: "CRM Integration", url: "https://api.example.com/webhooks/crm", status: "inactive", createdAt: "Nov 10, 2024", eventsToday: 0 },
  { id: "ep_008", name: "Slack Alerts", url: "https://api.example.com/webhooks/slack", status: "active", createdAt: "Nov 5, 2024", eventsToday: 89 },
];

const Endpoints = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewEndpointDialog, setShowNewEndpointDialog] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");
  const itemsPerPage = 8;

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(endpoint => {
      const matchesSearch = searchQuery === "" ||
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || endpoint.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [endpoints, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredEndpoints.length / itemsPerPage);
  const paginatedEndpoints = filteredEndpoints.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Endpoint URL copied to clipboard",
    });
  };

  const handleDelete = (id: string, name: string) => {
    setEndpoints(prev => prev.filter(e => e.id !== id));
    toast({
      title: "Endpoint deleted",
      description: `${name} has been removed`,
      variant: "destructive",
    });
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCreateEndpoint = () => {
    if (!newEndpointName || !newEndpointUrl) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newEndpoint: Endpoint = {
      id: `ep_${Date.now()}`,
      name: newEndpointName,
      url: newEndpointUrl,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      eventsToday: 0,
    };

    setEndpoints(prev => [newEndpoint, ...prev]);
    setShowNewEndpointDialog(false);
    setNewEndpointName("");
    setNewEndpointUrl("");
    
    toast({
      title: "Endpoint created",
      description: `${newEndpointName} has been added successfully`,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  const hasActiveFilters = searchQuery || statusFilter;

  const columns = [
    {
      key: "name" as keyof Endpoint,
      header: "Name",
      render: (item: Endpoint) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{item.url}</p>
        </div>
      )
    },
    {
      key: "url" as keyof Endpoint,
      header: "Endpoint URL",
      render: (item: Endpoint) => (
        <div className="flex items-center gap-2">
          <code className="text-xs bg-secondary px-2 py-1 rounded-md font-mono max-w-[300px] truncate text-foreground">
            {item.url}
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyUrl(item.url);
            }}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      ),
      className: "hidden lg:table-cell"
    },
    {
      key: "status" as keyof Endpoint,
      header: "Status",
      render: (item: Endpoint) => <StatusBadge status={item.status} />
    },
    {
      key: "eventsToday" as keyof Endpoint,
      header: "Events Today",
      render: (item: Endpoint) => <span className="text-sm tabular-nums text-foreground">{item.eventsToday.toLocaleString()}</span>,
      className: "hidden md:table-cell"
    },
    {
      key: "createdAt" as keyof Endpoint,
      header: "Created",
      render: (item: Endpoint) => <span className="text-sm text-muted-foreground">{item.createdAt}</span>,
      className: "hidden sm:table-cell"
    },
    {
      key: "actions" as keyof Endpoint,
      header: "",
      render: (item: Endpoint) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenExternal(item.url);
            }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id, item.name);
            }}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Delete endpoint"
          >
            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      ),
      className: "w-[120px]"
    }
  ];

  return (
    <div className="animate-fade-in">
      <DashboardHeader title="Endpoints" subtitle="Manage your webhook endpoints" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-foreground"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
          <button
            onClick={() => setShowNewEndpointDialog(true)}
            className="h-10 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Endpoint
          </button>
        </div>

        {/* Filter info */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            Showing {filteredEndpoints.length} of {endpoints.length} endpoints
          </div>
        )}

        {/* Table */}
        <Table columns={columns} data={paginatedEndpoints} />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredEndpoints.length)}</span> of <span className="font-medium">{filteredEndpoints.length}</span> endpoints
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-foreground"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-foreground"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Endpoint Dialog */}
      <Dialog open={showNewEndpointDialog} onOpenChange={setShowNewEndpointDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Endpoint</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new webhook endpoint to receive events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Endpoint Name</label>
              <input
                type="text"
                placeholder="e.g., Payment Webhook"
                value={newEndpointName}
                onChange={(e) => setNewEndpointName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Endpoint URL</label>
              <input
                type="url"
                placeholder="https://api.example.com/webhook"
                value={newEndpointUrl}
                onChange={(e) => setNewEndpointUrl(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEndpointDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEndpoint} className="gradient-primary text-primary-foreground">
              Create Endpoint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Endpoints;
