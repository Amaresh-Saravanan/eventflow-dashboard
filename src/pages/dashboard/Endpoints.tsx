import { useState, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Plus, MoreVertical, Copy, ExternalLink, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEndpoints } from "@/hooks/useEndpoints";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Endpoints = () => {
  const { endpoints, loading, createEndpoint, deleteEndpoint } = useEndpoints();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewEndpointDialog, setShowNewEndpointDialog] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
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

  const handleDelete = async (id: string, name: string) => {
    const success = await deleteEndpoint(id);
    if (success) {
      toast({
        title: "Endpoint deleted",
        description: `${name} has been removed`,
      });
    }
  };

  const handleOpenExternal = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCreateEndpoint = async () => {
    if (!newEndpointName || !newEndpointUrl) {
      toast({
        title: "Validation error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    const result = await createEndpoint(newEndpointName, newEndpointUrl);
    setIsCreating(false);

    if (result) {
      setShowNewEndpointDialog(false);
      setNewEndpointName("");
      setNewEndpointUrl("");
      toast({
        title: "Endpoint created",
        description: `${newEndpointName} has been added successfully`,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  const hasActiveFilters = searchQuery || statusFilter;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const columns = [
    {
      key: "name" as const,
      header: "Name",
      render: (item: typeof endpoints[0]) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{item.url}</p>
        </div>
      )
    },
    {
      key: "url" as const,
      header: "Endpoint URL",
      render: (item: typeof endpoints[0]) => (
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
      key: "status" as const,
      header: "Status",
      render: (item: typeof endpoints[0]) => <StatusBadge status={item.status} />
    },
    {
      key: "events_count" as const,
      header: "Events",
      render: (item: typeof endpoints[0]) => <span className="text-sm tabular-nums text-foreground">{item.events_count.toLocaleString()}</span>,
      className: "hidden md:table-cell"
    },
    {
      key: "created_at" as const,
      header: "Created",
      render: (item: typeof endpoints[0]) => <span className="text-sm text-muted-foreground">{formatDate(item.created_at)}</span>,
      className: "hidden sm:table-cell"
    },
    {
      key: "actions" as const,
      header: "",
      render: (item: typeof endpoints[0]) => (
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

  if (loading) {
    return (
      <div className="animate-fade-in">
        <DashboardHeader title="Endpoints" subtitle="Manage your webhook endpoints" />
        <div className="p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

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

        {/* Empty state */}
        {endpoints.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No endpoints yet</h3>
            <p className="text-muted-foreground mb-4">Create your first webhook endpoint to start receiving events</p>
            <button
              onClick={() => setShowNewEndpointDialog(true)}
              className="h-10 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create Endpoint
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
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
            <Button onClick={handleCreateEndpoint} disabled={isCreating} className="gradient-primary text-primary-foreground">
              {isCreating ? "Creating..." : "Create Endpoint"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Endpoints;
