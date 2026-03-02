import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ScoreBar } from "@/components/ScoreBar";
import { CircularScore } from "@/components/CircularScore";
import { trends, allTrends, getCategoryColor, getStatusColor } from "@/data/trends";
import { regulatoryDatabase } from "@/data/regulatory";
import { ArrowLeft, ExternalLink, AlertTriangle, CheckSquare, Youtube, MessageCircle, BookOpen, TrendingUp, Clock, Users, BarChart3 } from "lucide-react";

const TrendBrief = () => {
  const { id } = useParams<{ id: string }>();
  const trend = [...trends, ...allTrends].find((t) => t.id === id);

  if (!trend) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Trend not found</h1>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const regulatory = regulatoryDatabase.find(
    (r) => trend.name.toLowerCase().includes(r.ingredient.toLowerCase()) ||
           r.ingredient.toLowerCase().includes(trend.name.split(" ")[0].toLowerCase())
  );

  const timelineStages = [
    "Research Published",
    "Western Creators Pick Up",
    "Indian Search Begins",
    "Indian Creators Active",
    "Mainstream",
  ];

  const checklist = [
    "Validate demand with landing page test (Week 1-2)",
    "Find contract manufacturer on IndiaMart (Week 2-3)",
    "Check FSSAI licensing requirements (Week 1)",
    "Register on Amazon India as seller (Week 2)",
    "Partner with 2-3 micro influencers in this space (Week 3-4)",
    "Launch MVP with 100 units and collect reviews (Month 2)",
  ];

  const googleTrendsUrl = `https://trends.google.com/trends/explore?date=today%2012-m&geo=IN&q=${encodeURIComponent(trend.name)}`;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* Section 1: Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getCategoryColor(trend.category)}`}>
                {trend.category}
              </span>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(trend.status)}`}>
                {trend.status === "ACT NOW" ? "🔴" : "🟠"} {trend.status}
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground">{trend.name}</h1>
            <p className="mt-2 text-primary italic">"{trend.alert}"</p>
          </div>
          <CircularScore score={trend.score} size={80} strokeWidth={6} />
        </div>

        {/* Section 2: Live Signals Panel */}
        <div className="grid gap-5 md:grid-cols-3 mb-8">
          {/* Google Trends */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Google Trends (India)</h3>
            </div>
            <div className="aspect-video rounded-lg bg-background/50 border border-border overflow-hidden">
              <iframe
                src={`https://trends.google.com/trends/embed/explore/TIMESERIES?req=${encodeURIComponent(JSON.stringify({comparisonItem:[{keyword:trend.name,geo:"IN",time:"today 12-m"}],category:0,property:""}))}&tz=-330`}
                className="w-full h-full border-0"
                title="Google Trends"
              />
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-muted-foreground">Growth: <span className="font-mono text-success font-bold">{trend.gtGrowth}</span> in 12 months</p>
              <a href={googleTrendsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                View on Google Trends <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Social Signals */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-destructive" />
              <h3 className="font-bold text-sm text-foreground">Social Signals</h3>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-background/50 border border-border p-3 space-y-1">
                <p className="text-xs font-medium text-foreground flex items-center gap-1"><Youtube className="h-3 w-3 text-destructive" /> YouTube</p>
                <p className="text-xs text-muted-foreground">Total Views: <span className="font-mono text-foreground">{trend.youtubeViews}</span></p>
                <p className="text-xs text-muted-foreground">Indian Creators: <span className="font-mono text-foreground">{trend.youtubeCreators}</span></p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-3 space-y-1">
                <p className="text-xs font-medium text-foreground flex items-center gap-1"><MessageCircle className="h-3 w-3 text-accent" /> Reddit</p>
                <p className="text-xs text-muted-foreground">Total Posts: <span className="font-mono text-foreground">{trend.redditPosts}</span></p>
                <p className="text-xs text-muted-foreground">India Mentions: <span className="font-mono text-foreground">{trend.redditIndiaMentions}</span></p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-3 space-y-1">
                <p className="text-xs font-medium text-foreground">📸 Instagram</p>
                <p className="text-xs text-muted-foreground">Hashtag Volume: <span className="font-mono text-foreground">{trend.instagramHashtags}</span></p>
              </div>
            </div>
          </div>

          {/* Research Signal */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-sm text-foreground">Research Signal</h3>
            </div>
            <div className="rounded-lg bg-background/50 border border-border p-3 space-y-2">
              <p className="text-xs text-muted-foreground">PubMed Studies Found: <span className="font-mono text-foreground font-bold">{trend.pubmedPapers}</span></p>
              <p className="text-xs text-muted-foreground">Clinical Backing: <span className={trend.clinicalBacking ? "text-success font-bold" : "text-destructive"}>
                {trend.clinicalBacking ? "✅ Yes" : "❌ No"}
              </span></p>
              <div className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/30 px-2 py-0.5 text-xs text-success font-medium">
                🔬 New Research Signal
              </div>
            </div>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(trend.name + " supplement")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View on PubMed <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Section 3: Regulatory Status */}
        {regulatory && (
          <div className="rounded-xl border border-border bg-card p-5 mb-8">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" /> Regulatory Status
            </h3>
            {regulatory.riskLevel === "High" && (
              <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-destructive">🚨 REGULATORY ALERT</p>
                  <p className="text-xs text-destructive/80 mt-1">{regulatory.notes}</p>
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-background/50 border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">FSSAI (India)</p>
                <p className="text-sm font-medium text-foreground">{regulatory.fssai}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">FDA (USA)</p>
                <p className="text-sm font-medium text-foreground">{regulatory.fda}</p>
              </div>
              <div className="rounded-lg bg-background/50 border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">EFSA (Europe)</p>
                <p className="text-sm font-medium text-foreground">{regulatory.efsa}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Max Dosage: {regulatory.maxDosage}</p>
          </div>
        )}

        {/* Section 4: Score Breakdown */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Score Breakdown
          </h3>
          <div className="space-y-4">
            <ScoreBar label="① Velocity Score" score={trend.velocity} description={`Searches growing ${trend.gtGrowth} in 12 months`} />
            <ScoreBar label="② Market Size Potential" score={trend.marketSize} description={`Estimated ${trend.marketSizeLabel} addressable market in India`} />
            <ScoreBar label="③ Competition Intensity" score={trend.competition} description={`${trend.competitionLandscape} currently active`} />
            <ScoreBar label="④ Time-to-Mainstream" score={trend.timeToMainstream} description={`Estimated ${trend.timeWindow} before mainstream`} />
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">TOTAL</span>
            <span className="text-2xl font-black font-mono text-primary">{trend.score}/100</span>
          </div>
        </div>

        {/* Section 5: Opportunity Brief */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8 space-y-5">
          <h3 className="font-bold text-foreground">📋 Opportunity Brief</h3>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">The Signal</h4>
            <p className="text-sm text-muted-foreground">{trend.signal}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">The Gap</h4>
            <p className="text-sm text-muted-foreground">{trend.gap}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Consumer Voice (Answer The Public)</h4>
            <ul className="space-y-1">
              {trend.consumerVoice.map((q) => (
                <li key={q} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">?</span> {q}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">The Opportunity</h4>
            <p className="text-sm text-muted-foreground">{trend.opportunity}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Competitor Blind Spot</h4>
            <p className="text-sm text-muted-foreground">{trend.competitorBlindSpot}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">First Mover Window</h4>
            <p className="text-sm text-muted-foreground">{trend.firstMoverWindow}</p>
          </div>
        </div>

        {/* Section 6: Timeline */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h3 className="font-bold text-foreground mb-6">📍 Adoption Timeline</h3>
          <div className="relative">
            <div className="h-2 rounded-full bg-muted/30 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                style={{ width: `${trend.timelinePosition}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-2 border-foreground shadow-lg"
                style={{ left: `${trend.timelinePosition}%`, transform: `translate(-50%, -50%)` }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {timelineStages.map((stage, i) => (
                <span key={stage} className={`text-[10px] text-center max-w-[80px] ${
                  i <= Math.floor(trend.timelinePosition / 25) ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 7: Checklist */}
        <div className="rounded-xl border border-border bg-card p-5 mb-8">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" /> ACT NOW Checklist
          </h3>
          <div className="space-y-3">
            {checklist.map((item) => (
              <label key={item} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border bg-background accent-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrendBrief;
