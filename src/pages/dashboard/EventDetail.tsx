import { useParams, Link } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import StatusBadge from "@/components/StatusBadge";
import CodeBlock from "@/components/CodeBlock";
import { ArrowLeft, RefreshCw, Copy, Clock, Server, Globe, Hash } from "lucide-react";
const mockEvent = {
  id: "evt_1a2b3c4d5e",
  endpoint: {
    name: "Stripe Payments",
    url: "https://api.example.com/webhooks/stripe"
  },
  eventType: "payment.succeeded",
  status: "success" as const,
  timestamp: "Dec 28, 2024 14:32:15.847 UTC",
  duration: "45ms",
  attempts: 1,
  ipAddress: "54.187.205.235",
  headers: {
    "Content-Type": "application/json",
    "Stripe-Signature": "t=1703778735,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd",
    "User-Agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive"
  },
  payload: {
    id: "evt_1MqLRF2eZvKYlo2C1234ABCD",
    object: "event",
    api_version: "2023-10-16",
    created: 1703778735,
    data: {
      object: {
        id: "pi_3MqLRF2eZvKYlo2C1234ABCD",
        object: "payment_intent",
        amount: 2499,
        currency: "usd",
        status: "succeeded",
        customer: "cus_NhD8HD2bY8dP3V",
        metadata: {
          order_id: "ord_12345",
          product_name: "Pro Plan Subscription"
        }
      }
    },
    type: "payment_intent.succeeded"
  },
  response: {
    statusCode: 200,
    body: {
      received: true
    },
    headers: {
      "Content-Type": "application/json"
    }
  }
};
const EventDetail = () => {
  const {
    id
  } = useParams();
  return <div className="animate-fade-in">
      <DashboardHeader title={`Event ${id || mockEvent.id}`} subtitle="View event details and payload" />
      
      <div className="p-6 space-y-6">
        {/* Back link and actions */}
        <div className="flex items-center justify-between">
          <Link to="/dashboard/events" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button className="h-9 px-4 rounded-lg bg-secondary border border-border text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors text-muted-foreground">
              <Copy className="w-4 h-4" />
              Copy ID
            </button>
          </div>
        </div>

        {/* Event Metadata */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 text-muted-foreground">Event Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span className="text-sm">Event ID</span>
              </div>
              <code className="text-sm font-mono bg-secondary px-2 py-1 rounded-md text-muted-foreground">{mockEvent.id}</code>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Server className="w-4 h-4" />
                <span className="text-sm">Endpoint</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{mockEvent.endpoint.name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Timestamp</span>
              </div>
              <p className="text-sm tabular-nums text-muted-foreground">{mockEvent.timestamp}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Source IP</span>
              </div>
              <code className="text-sm font-mono text-muted-foreground">{mockEvent.ipAddress}</code>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <div>
                <StatusBadge status={mockEvent.status} />
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Event Type</span>
              <code className="block text-sm font-mono text-primary">{mockEvent.eventType}</code>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Duration</span>
              <p className="text-sm font-medium text-muted-foreground">{mockEvent.duration}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Attempts</span>
              <p className="text-sm font-medium text-muted-foreground">{mockEvent.attempts}</p>
            </div>
          </div>
        </div>

        {/* Request & Response Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Headers */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 text-secondary-foreground">Request Headers</h3>
            <div className="space-y-3">
              {Object.entries(mockEvent.headers).map(([key, value]) => <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{key}</span>
                  <code className="text-sm font-mono bg-secondary/50 px-3 py-2 rounded-lg break-all text-muted-foreground">{value}</code>
                </div>)}
            </div>
          </div>

          {/* Response */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 text-secondary-foreground">Response</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Status Code:</span>
                <span className="px-2 py-1 rounded-md bg-success/15 text-success text-sm font-medium">
                  {mockEvent.response.statusCode}
                </span>
              </div>
              <CodeBlock code={JSON.stringify(mockEvent.response.body, null, 2)} language="json" title="Response Body" />
            </div>
          </div>
        </div>

        {/* Request Payload */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Request Payload</h3>
          <CodeBlock code={JSON.stringify(mockEvent.payload, null, 2)} language="json" title="JSON Payload" />
        </div>
      </div>
    </div>;
};
export default EventDetail;