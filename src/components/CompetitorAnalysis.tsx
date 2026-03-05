import { TrendData } from "@/data/trends";
import { ShieldAlert, TrendingDown, IndianRupee, Star, ExternalLink } from "lucide-react";
interface CompetitorAnalysisProps {
  trend: TrendData;
}
export const CompetitorAnalysis = ({ trend }: CompetitorAnalysisProps) => {
  const { competitors, competitorBlindSpot } = trend;
  return (
    <div className="space-y-5">
      {/* Blind Spot */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex gap-3">
        <ShieldAlert className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-destructive mb-1">Market Blind Spot</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{competitorBlindSpot}</p>
        </div>
      </div>
      {/* Competitor cards */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-accent" />
          Current Players in Market
        </h4>
        <div className="space-y-3">
          {competitors.map((comp, i) => (
            <div key={i} className="rounded-xl border border-border bg-background overflow-hidden">
              <div className="flex">
                {/* Product image */}
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-muted">
                  <img
                    src={comp.imageUrl}
                    alt={comp.brand}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                {/* Info */}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-foreground">{comp.brand}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${comp.isIndian ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30"}`}>
                          {comp.isIndian ? "Indian" : "Import"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{comp.product}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-primary font-bold text-sm flex-shrink-0">
                      <IndianRupee className="h-3 w-3" />
                      <span>{comp.price.replace("\u20B9", "").replace("Rs.", "").trim()}</span>
                    </div>
                  </div>
                  {/* Reviews */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-muted-foreground">{comp.reviews} reviews</span>
                  </div>
                </div>
              </div>
              {/* Weakness bar - full width below */}
              <div className="px-3 pb-3">
                <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/15 rounded-lg px-3 py-2">
                  <span className="text-destructive text-xs font-bold mt-0.5 flex-shrink-0">GAP</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{comp.weakness}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* YOUR EDGE - specific to this trend, not generic */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Your Edge</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {trend.keyInsight}
        </p>
      </div>
    </div>
  );
};
