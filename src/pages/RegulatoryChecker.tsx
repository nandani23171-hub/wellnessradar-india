import { useState } from "react";
import { Layout } from "@/components/Layout";
import { regulatoryDatabase, getRiskColor } from "@/data/regulatory";
import { Search, AlertTriangle, Shield } from "lucide-react";

const RegulatoryChecker = () => {
  const [search, setSearch] = useState("");

  const filtered = regulatoryDatabase.filter((item) =>
    item.ingredient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h1 className="text-3xl font-black text-foreground mb-2">
          <Shield className="inline h-8 w-8 text-primary mr-2" />
          Ingredient & Regulatory Safety Checker
        </h1>
        <p className="text-muted-foreground mb-6">
          Before you build — know if your ingredient is legal, approved, and safe to sell in India.
        </p>

        {/* Red Alert Banner */}
        <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            <strong>⚠️ Always verify with FSSAI directly before launching.</strong> This tool is for research purposes only.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients (e.g., Ashwagandha, NMN, Creatine)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filtered.map((item) => (
            <div key={item.ingredient} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">{item.ingredient}</h3>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getRiskColor(item.riskLevel)}`}>
                  {item.riskLevel === "High" ? "🔴" : item.riskLevel === "Medium" ? "🟡" : "🟢"} {item.riskLevel} Risk
                </span>
              </div>

              {/* Regulatory Alert */}
              {item.riskLevel === "High" && (
                <div className="border-b border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-destructive">🚨 REGULATORY ALERT: This ingredient has restrictions in India — verify FSSAI compliance before launching</p>
                    <p className="text-xs text-destructive/80 mt-1">{item.warningsRequired}</p>
                  </div>
                </div>
              )}

              {/* Status Grid */}
              <div className="grid gap-px sm:grid-cols-3 bg-border">
                <div className="bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FSSAI (India)</p>
                  <p className="text-sm text-foreground">{item.fssai}</p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">FDA (USA)</p>
                  <p className="text-sm text-foreground">{item.fda}</p>
                </div>
                <div className="bg-card p-4">
                  <p className="text-xs text-muted-foreground mb-1 font-bold uppercase tracking-wider">EFSA (Europe)</p>
                  <p className="text-sm text-foreground">{item.efsa}</p>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Max Dosage</p>
                  <p className="text-sm text-foreground">{item.maxDosage}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Labelling Requirement</p>
                  <p className="text-sm text-foreground">{item.labellingRequirement}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Warnings Required</p>
                  <p className="text-sm text-foreground">{item.warningsRequired}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Notes</p>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No ingredients found matching "{search}". Try a different search.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegulatoryChecker;
