import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Plus, MoreVertical, Copy, ExternalLink, Trash2 } from "lucide-react";
interface Endpoint {
  id: string;
  name: string;
  url: string;
  status: "active" | "inactive";
  createdAt: string;
  eventsToday: number;
}
const endpoints: Endpoint[] = [{
  id: "ep_001",
  name: "Stripe Payments",
  url: "https://api.example.com/webhooks/stripe",
  status: "active",
  createdAt: "Dec 15, 2024",
  eventsToday: 1247
}, {
  id: "ep_002",
  name: "User Signups",
  url: "https://api.example.com/webhooks/users",
  status: "active",
  createdAt: "Dec 10, 2024",
  eventsToday: 892
}, {
  id: "ep_003",
  name: "Order Updates",
  url: "https://api.example.com/webhooks/orders",
  status: "inactive",
  createdAt: "Dec 5, 2024",
  eventsToday: 0
}, {
  id: "ep_004",
  name: "Inventory Sync",
  url: "https://api.example.com/webhooks/inventory",
  status: "active",
  createdAt: "Nov 28, 2024",
  eventsToday: 456
}, {
  id: "ep_005",
  name: "Analytics Events",
  url: "https://api.example.com/webhooks/analytics",
  status: "active",
  createdAt: "Nov 20, 2024",
  eventsToday: 2341
}, {
  id: "ep_006",
  name: "Email Notifications",
  url: "https://api.example.com/webhooks/email",
  status: "active",
  createdAt: "Nov 15, 2024",
  eventsToday: 187
}, {
  id: "ep_007",
  name: "CRM Integration",
  url: "https://api.example.com/webhooks/crm",
  status: "inactive",
  createdAt: "Nov 10, 2024",
  eventsToday: 0
}, {
  id: "ep_008",
  name: "Slack Alerts",
  url: "https://api.example.com/webhooks/slack",
  status: "active",
  createdAt: "Nov 5, 2024",
  eventsToday: 89
}];
const columns = [{
  key: "name" as keyof Endpoint,
  header: "Name",
  render: (item: Endpoint) => <div>
        <p className="font-medium text-muted-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{item.url}</p>
      </div>
}, {
  key: "url" as keyof Endpoint,
  header: "Endpoint URL",
  render: (item: Endpoint) => <div className="flex items-center gap-2">
        <code className="text-xs bg-secondary px-2 py-1 rounded-md font-mono max-w-[300px] truncate text-muted-foreground">
          {item.url}
        </code>
        <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>,
  className: "hidden lg:table-cell"
}, {
  key: "status" as keyof Endpoint,
  header: "Status",
  render: (item: Endpoint) => <StatusBadge status={item.status} />
}, {
  key: "eventsToday" as keyof Endpoint,
  header: "Events Today",
  render: (item: Endpoint) => <span className="text-sm tabular-nums text-muted-foreground">{item.eventsToday.toLocaleString()}</span>,
  className: "hidden md:table-cell"
}, {
  key: "createdAt" as keyof Endpoint,
  header: "Created",
  render: (item: Endpoint) => <span className="text-sm text-muted-foreground">{item.createdAt}</span>,
  className: "hidden sm:table-cell"
}, {
  key: "actions" as keyof Endpoint,
  header: "",
  render: () => <div className="flex items-center justify-end gap-1">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>,
  className: "w-[120px]"
}];
const Endpoints = () => {
  return <div className="animate-fade-in">
      <DashboardHeader title="Endpoints" subtitle="Manage your webhook endpoints" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search endpoints..." className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <select className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-muted-foreground">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="h-10 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Endpoint
          </button>
        </div>

        {/* Table */}
        <Table columns={columns} data={endpoints} />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1-8</span> of <span className="font-medium">24</span> endpoints
          </p>
          <div className="flex items-center gap-2">
            <button disabled className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-primary-foreground">
              Previous
            </button>
            <button className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors text-muted-foreground">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Endpoints;