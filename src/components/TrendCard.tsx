import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { TrendData, getCategoryColor, getStatusColor } from "@/data/trends";
import { CircularScore } from "./CircularScore";
import { ScoreBar } from "./ScoreBar";

interface TrendCardProps {
  trend: TrendData;
  index: number;
}

export const TrendCard = ({ trend, index }: TrendCardProps) => {
  return (
    <div
      className="glow-card rounded-xl border border-border bg-card p-5 flex flex-col gap-4 opacity-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground leading-tight">{trend.name}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(trend.category)}`}>
              {trend.category}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusColor(trend.status)}`}>
              {trend.status === "ACT NOW" ? "🔴" : trend.status === "HIGH PRIORITY" ? "🟠" : "🟡"} {trend.status}
            </span>
          </div>
        </div>
        <CircularScore score={trend.score} />
      </div>

      {/* Alert */}
      <p className="text-xs text-primary/90 italic border-l-2 border-primary/40 pl-3">
        "{trend.alert}"
      </p>

      {/* Mini Score Bars */}
      <div className="space-y-2">
        <ScoreBar label="Velocity" score={trend.velocity} />
        <ScoreBar label="Market Size" score={trend.marketSize} />
        <ScoreBar label="Competition" score={trend.competition} />
      </div>

      {/* Time indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{trend.timeWindow} to mainstream</span>
      </div>

      {/* CTA */}
      <Link
        to={`/trend/${trend.id}`}
        className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        View Full Brief <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};
