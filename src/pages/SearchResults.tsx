// src/pages/SearchResults.tsx

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  ArrowLeft, Search, TrendingUp,
  ShieldCheck, AlertCircle, CheckCircle2, XCircle, Zap,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

interface AIResult {
  name: string;
  verdict: string;
  verdictReason: string;
  score: number;
  recommendedAction: string;
  gtGrowthEstimate: string;
  marketSizeIndia: string;
  indiaReadiness: string;
  timeToMainstream: string;
  competitionIndia: string;
  signal: string;
  gap: string;
  opportunity: string;
  fadVsReal: {
    clinicalBacking: boolean;
    westernMainstream2yrs: boolean;
    solvesRealPain: boolean;
    indiaSpecificNeed: boolean;
  };
  consumerQuestions: string[];
  trendData?: number[];
}

const LOADING_STEPS = [
  "Fetching Google Trends India data",
  "Calculating growth velocity",
  "Estimating market size",
  "Generating opportunity brief",
];

const MONTHS = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

function ScoreRing({ score }: { score: number }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#EF4444" : score >= 60 ? "#F97316" : "#F59E0B";
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3.5" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-black text-sm" style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function getVerdictStyles(verdict: string) {
  switch (verdict) {
    case "REAL TREND":         return { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  badge: "bg-green-100 text-green-700 border-green-200" };
    case "EARLY SIGNAL":       return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700 border-amber-200" };
    case "FAD":                return { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-100 text-red-700 border-red-200" };
    case "MAINSTREAM ALREADY": return { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-100 text-blue-700 border-blue-200" };
    default:                   return { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-100 text-amber-700 border-amber-200" };
  }
}

function getActionStyles(action: string) {
  switch (action) {
    case "ACT NOW":       return "bg-destructive/10 text-destructive border-destructive/30";
    case "WATCH":         return "bg-accent/10 text-accent border-accent/30";
    case "RESEARCH MORE": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    default:              return "bg-muted text-muted-foreground border-border";
  }
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [state, setState] = useState<"loading" | "result" | "error">("loading");
  const [dotStep, setDotStep] = useState(0);
  const [result, setResult] = useState<AIResult | null>(null);
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    if (!query.trim()) return;
    setInputValue(query);
    runAnalysis(query);
  }, [query]);

  const runAnalysis = async (q: string) => {
    setState("loading");
    setDotStep(0);
    setResult(null);
    setErrorDetail("");

    const iv = setInterval(
      () => setDotStep((d) => Math.min(d + 1, LOADING_STEPS.length - 1)),
      800
    );

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      if (!data.name || !data.verdict) throw new Error("Bad response: " + JSON.stringify(data).slice(0, 100));

      clearInterval(iv);
      setResult(data as AIResult);
      setState("result");
    } catch (err: any) {
      clearInterval(iv);
      setErrorDetail(err.message || "Unknown error");
      setState("error");
    }
  };

  const handleNewSearch = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === query) return;
    setSearchParams({ q: trimmed });
  };

  const vs = result ? getVerdictStyles(result.verdict) : null;

  // Build chart data from trendData array
  const chartData = result?.trendData
    ? result.trendData
        .filter((_, i) => i % Math.max(1, Math.floor(result.trendData!.length / 12)) === 0)
        .slice(0, 12)
        .map((v, i) => ({ month: MONTHS[i] || `W${i}`, value: v }))
    : [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Back + search bar */}
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewSearch()}
                placeholder="Search another trend..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <button
              onClick={handleNewSearch}
              disabled={!inputValue.trim() || inputValue.trim() === query}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
            >
              Analyze →
            </button>
          </div>
        </div>

        {/* Loading */}
        {state === "loading" && (
          <div className="rounded-2xl border border-border bg-card p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin flex-shrink-0" />
              <span className="text-sm text-foreground">
                Analysing <span className="font-bold text-primary">"{query}"</span> using live Google Trends data...
              </span>
            </div>
            <div className="space-y-3 pl-2">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3 transition-opacity duration-500" style={{ opacity: i <= dotStep ? 1 : 0.2 }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: i < dotStep ? "hsl(var(--primary))" : i === dotStep ? "hsl(var(--accent))" : "hsl(var(--muted))",
                  }} />
                  <span className={`text-sm ${i < dotStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {step}{i < dotStep ? " ✓" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive mb-1">Analysis Failed</p>
              <p className="text-sm text-muted-foreground mb-2">
                Make sure <code className="bg-muted px-1 rounded text-xs">node server.js</code> is running inside the <code className="bg-muted px-1 rounded text-xs">server</code> folder.
              </p>
              {errorDetail && (
                <p className="text-xs text-muted-foreground bg-muted rounded p-2 font-mono break-all">{errorDetail}</p>
              )}
              <button onClick={() => runAnalysis(query)} className="mt-3 text-sm font-semibold text-primary hover:underline">
                Try again →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {state === "result" && result && vs && (
          <div className="space-y-4 animate-fade-in">

            {/* Verdict hero */}
            <div className={`rounded-2xl border ${vs.border} ${vs.bg} p-6 flex items-start justify-between gap-4`}>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${vs.badge}`}>{result.verdict}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getActionStyles(result.recommendedAction)}`}>{result.recommendedAction}</span>
                </div>
                <h1 className="text-2xl font-black text-foreground mb-2">{result.name}</h1>
                <p className={`text-sm font-medium ${vs.text} leading-relaxed`}>{result.verdictReason}</p>
              </div>
              <ScoreRing score={result.score} />
            </div>

            {/* Live trend chart */}
            {chartData.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Google Trends India — Live 12 Month Data</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Live
                  </span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="hsl(16,80%,44%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(16,80%,44%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [v + "/100", "Search Interest"]}
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(16,80%,44%)" strokeWidth={2.5}
                        fill="url(#trendGrad)" dot={false}
                        activeDot={{ r: 4, fill: "hsl(16,80%,44%)", stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 5 metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([
                ["Est. Growth",  result.gtGrowthEstimate, "text-primary"],
                ["Market Size",  result.marketSizeIndia,  "text-foreground"],
                ["Readiness",    result.indiaReadiness,   "text-green-600"],
                ["Competition",  result.competitionIndia, "text-foreground"],
                ["Time Window",  result.timeToMainstream, "text-green-600"],
              ] as [string, string, string][]).map(([label, value, color]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-muted-foreground font-medium mb-1 uppercase tracking-wide" style={{ fontSize: 10 }}>{label}</p>
                  <p className={`text-sm font-bold ${color} leading-tight`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Fad filter */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">Fad vs Real Trend Filter</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  ["Clinical Backing",          result.fadVsReal.clinicalBacking],
                  ["Western Mainstream 2+ yrs", result.fadVsReal.westernMainstream2yrs],
                  ["Solves Real Pain",          result.fadVsReal.solvesRealPain],
                  ["India-Specific Need",       result.fadVsReal.indiaSpecificNeed],
                ] as [string, boolean][]).map(([label, val]) => (
                  <div key={label} className={`flex items-center gap-2.5 p-3 rounded-xl border ${val ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    {val ? <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                    <span className={`text-xs font-semibold ${val ? "text-green-700" : "text-red-600"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal + Gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">The Signal</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.signal}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-bold text-destructive uppercase tracking-widest">The Gap</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.gap}</p>
              </div>
            </div>

            {/* Opportunity */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">The Opportunity</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{result.opportunity}</p>
            </div>

            {/* Consumer questions */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">What Consumers Are Asking</p>
              <div className="space-y-2.5">
                {result.consumerQuestions.map((q) => (
                  <div key={q} className="text-sm text-foreground border-l-2 border-primary/30 pl-3 py-0.5">{q}</div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pb-4">
              Analysis based on live Google Trends India data. Market estimates are indicative — verify before product launch.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;



