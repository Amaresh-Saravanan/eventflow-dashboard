import { LucideIcon } from "lucide-react";
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}
const StatCard = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon
}: StatCardProps) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-muted-foreground"
  };
  return <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-secondary-foreground">{value}</p>
          {change && <p className={`text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </p>}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>;
};
export default StatCard;