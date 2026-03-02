import { Layout } from "@/components/Layout";
import { Radar, Database, BarChart3, RefreshCw } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl font-black text-foreground mb-2">Why This Radar Exists</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed mb-12">
          <p>
            Most trend detection today is reactive, manual, and relies on gut feel. Founders see what's already popular and chase it — arriving too late to build meaningful market share.
          </p>
          <p>
            <strong className="text-foreground">WellnessRadar India was built to solve this.</strong> We scan 150+ wellness signals every month across 5 data sources, filter using a 4-dimension scoring framework, and surface only the opportunities where consumer demand is rising faster than Indian market supply.
          </p>
          <p>
            The output isn't a data dump. It's an opportunity brief a founder can act on immediately.
          </p>
        </div>

        {/* Data Sources */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Data Sources Used
          </h2>
          <div className="space-y-3">
            {[
              { name: "Google Trends India API (pytrends)", detail: "140+ keywords tracked" },
              { name: "Reddit PullPush API", detail: "20 wellness subreddits monitored" },
              { name: "Amazon India scraping", detail: "Competitive landscape and pricing" },
              { name: "YouTube Data API", detail: "Video intent and creator coverage analysis" },
              { name: "Answer The Public", detail: "Consumer question mapping" },
              { name: "PubMed RSS feeds", detail: "Research publication tracking" },
              { name: "FSSAI official database", detail: "Regulatory compliance checking" },
            ].map((src) => (
              <div key={src.name} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-sm">{src.name}</p>
                  <p className="text-xs text-muted-foreground">{src.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring Accuracy */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" /> Scoring Accuracy
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Scores are recalculated monthly. A trend's score can go up (if competition remains low and searches keep rising) or down (if major brands enter or trend approaches mainstream). This is a <strong className="text-foreground">dynamic system, not a static report.</strong>
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default About;
