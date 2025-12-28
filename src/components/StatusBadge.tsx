interface StatusBadgeProps {
  status: "active" | "inactive" | "success" | "failed" | "pending" | "info" | "warn" | "error";
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const statusConfig = {
    active: { className: "status-pill status-success", text: "Active" },
    inactive: { className: "status-pill status-pending", text: "Inactive" },
    success: { className: "status-pill status-success", text: "Success" },
    failed: { className: "status-pill status-error", text: "Failed" },
    pending: { className: "status-pill status-pending", text: "Pending" },
    info: { className: "status-pill status-info", text: "Info" },
    warn: { className: "status-pill bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_50%)]", text: "Warning" },
    error: { className: "status-pill status-error", text: "Error" },
  };

  const config = statusConfig[status];

  return (
    <span className={config.className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {label || config.text}
    </span>
  );
};

export default StatusBadge;
