import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import Table from "@/components/Table";
import StatusBadge from "@/components/StatusBadge";
import { Filter, Download } from "lucide-react";
interface Event {
  id: string;
  eventId: string;
  endpoint: string;
  eventType: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
  duration: string;
}
const events: Event[] = [{
  id: "1",
  eventId: "evt_1a2b3c4d5e",
  endpoint: "Stripe Payments",
  eventType: "payment.succeeded",
  status: "success",
  timestamp: "Dec 28, 2024 14:32:15",
  duration: "45ms"
}, {
  id: "2",
  eventId: "evt_2b3c4d5e6f",
  endpoint: "User Signups",
  eventType: "user.created",
  status: "success",
  timestamp: "Dec 28, 2024 14:31:42",
  duration: "32ms"
}, {
  id: "3",
  eventId: "evt_3c4d5e6f7g",
  endpoint: "Order Updates",
  eventType: "order.updated",
  status: "failed",
  timestamp: "Dec 28, 2024 14:30:18",
  duration: "1.2s"
}, {
  id: "4",
  eventId: "evt_4d5e6f7g8h",
  endpoint: "Inventory Sync",
  eventType: "inventory.changed",
  status: "success",
  timestamp: "Dec 28, 2024 14:28:55",
  duration: "67ms"
}, {
  id: "5",
  eventId: "evt_5e6f7g8h9i",
  endpoint: "Stripe Payments",
  eventType: "payment.refunded",
  status: "pending",
  timestamp: "Dec 28, 2024 14:27:33",
  duration: "-"
}, {
  id: "6",
  eventId: "evt_6f7g8h9i0j",
  endpoint: "Analytics Events",
  eventType: "page.viewed",
  status: "success",
  timestamp: "Dec 28, 2024 14:26:12",
  duration: "28ms"
}, {
  id: "7",
  eventId: "evt_7g8h9i0j1k",
  endpoint: "Email Notifications",
  eventType: "email.sent",
  status: "success",
  timestamp: "Dec 28, 2024 14:25:01",
  duration: "156ms"
}, {
  id: "8",
  eventId: "evt_8h9i0j1k2l",
  endpoint: "CRM Integration",
  eventType: "contact.updated",
  status: "failed",
  timestamp: "Dec 28, 2024 14:23:44",
  duration: "2.1s"
}, {
  id: "9",
  eventId: "evt_9i0j1k2l3m",
  endpoint: "Slack Alerts",
  eventType: "alert.triggered",
  status: "success",
  timestamp: "Dec 28, 2024 14:22:19",
  duration: "89ms"
}, {
  id: "10",
  eventId: "evt_0j1k2l3m4n",
  endpoint: "User Signups",
  eventType: "user.verified",
  status: "success",
  timestamp: "Dec 28, 2024 14:21:05",
  duration: "41ms"
}];
const columns = [{
  key: "eventId" as keyof Event,
  header: "Event ID",
  render: (item: Event) => <code className="text-xs bg-secondary px-2 py-1 rounded-md font-mono text-muted-foreground">{item.eventId}</code>
}, {
  key: "endpoint" as keyof Event,
  header: "Endpoint",
  render: (item: Event) => <span className="font-medium text-sm text-muted-foreground">{item.endpoint}</span>
}, {
  key: "eventType" as keyof Event,
  header: "Event Type",
  render: (item: Event) => <code className="text-xs text-muted-foreground font-mono">{item.eventType}</code>,
  className: "hidden md:table-cell"
}, {
  key: "status" as keyof Event,
  header: "Status",
  render: (item: Event) => <StatusBadge status={item.status} />
}, {
  key: "duration" as keyof Event,
  header: "Duration",
  render: (item: Event) => <span className="text-muted-foreground">
        {item.duration}
      </span>,
  className: "hidden sm:table-cell"
}, {
  key: "timestamp" as keyof Event,
  header: "Timestamp",
  render: (item: Event) => <span className="text-sm text-muted-foreground tabular-nums">{item.timestamp}</span>,
  className: "hidden lg:table-cell"
}];
const Events = () => {
  const navigate = useNavigate();
  const handleRowClick = (event: Event) => {
    navigate(`/dashboard/events/${event.eventId}`);
  };
  return <div className="animate-fade-in">
      <DashboardHeader title="Events" subtitle="View all webhook events and their delivery status" />
      
      <div className="p-6 space-y-6">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="Search events..." className="w-64 h-10 px-4 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <select className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-muted-foreground">
              <option value="">All endpoints</option>
              <option value="stripe">Stripe Payments</option>
              <option value="users">User Signups</option>
              <option value="orders">Order Updates</option>
            </select>
            <select className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer text-muted-foreground">
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="h-10 px-4 rounded-xl bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} data={events} onRowClick={handleRowClick} />

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1-10</span> of <span className="font-medium">1,247</span> events
          </p>
          <div className="flex items-center gap-2">
            <button disabled className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 text-muted-foreground">
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium">1</button>
              <button className="w-9 h-9 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 text-muted-foreground">2</button>
              <button className="w-9 h-9 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 text-muted-foreground">3</button>
              <span className="px-2 text-muted-foreground">...</span>
              <button className="w-9 h-9 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 text-muted-foreground">125</button>
            </div>
            <button className="h-9 px-4 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors text-muted-foreground">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Events;