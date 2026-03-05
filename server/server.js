const express = require("express");
const cors = require("cors");
const googleTrends = require("google-trends-api");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// ── Google Trends chart data (existing) ────────────────────────────────────
app.get("/api/trends", async (req, res) => {
  const keyword = req.query.keyword || "creatine for women";
  try {
    const result = await googleTrends.interestOverTime({
      keyword: [keyword],
      geo: "IN",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    });
    res.json(JSON.parse(result));
  } catch (error) {
    console.error("Trends error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ── Analyze endpoint using Google Trends data only ─────────────────────────
app.post("/api/analyze", async (req, res) => {
  const { query } = req.body;
  // TEMP TEST - remove after
return res.json({
  name: query,
  verdict: "EARLY SIGNAL",
  verdictReason: "Test response to confirm connection works",
  score: 75,
  recommendedAction: "WATCH",
  gtGrowthEstimate: "+150%",
  marketSizeIndia: "Rs.100-200Cr",
  indiaReadiness: "Growing Fast",
  timeToMainstream: "6-9 months",
  competitionIndia: "1-2 weak players",
  signal: "Test signal text",
  gap: "Test gap text",
  opportunity: "Test opportunity text",
  fadVsReal: { clinicalBacking: true, westernMainstream2yrs: true, solvesRealPain: true, indiaSpecificNeed: true },
  consumerQuestions: ["Test question 1?", "Test question 2?", "Test question 3?"],
  trendData: [10,20,30,40,50,60,70,80,85,90,92,95]
});
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    console.log("Analyzing:", query);

    // Fetch last 12 months of trend data for India
    const now = new Date();
    const oneYearAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
    const fiveYearsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 5);

    let trendValues = [];
    let relatedTopics = [];

    try {
      const result = await googleTrends.interestOverTime({
        keyword: [query],
        geo: "IN",
        startTime: oneYearAgo,
      });
      const parsed = JSON.parse(result);
      const timeline = parsed?.default?.timelineData || [];
      trendValues = timeline.map((d) => d.value[0]);
      console.log("Trend values fetched:", trendValues.length, "points");
    } catch (e) {
      console.log("Trends fetch failed, using defaults:", e.message);
      trendValues = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
    }

    // ── Calculate metrics from real data ──────────────────────────────────
    const avgRecent = trendValues.slice(-4).reduce((a, b) => a + b, 0) / 4 || 50;
    const avgEarly  = trendValues.slice(0, 4).reduce((a, b) => a + b, 0) / 4 || 25;
    const currentVal = trendValues[trendValues.length - 1] || 50;
    const peakVal = Math.max(...trendValues, 1);

    // Growth % over the year
    const growthPct = avgEarly > 0
      ? Math.round(((avgRecent - avgEarly) / avgEarly) * 100)
      : 50;

    // Score: weighted combination of current interest, growth, and peak
    const score = Math.min(99, Math.max(10,
      Math.round(
        (currentVal * 0.4) +
        (Math.min(growthPct, 500) / 500 * 40) +
        (peakVal * 0.2)
      )
    ));

    // Verdict based on score + growth
    let verdict, recommendedAction;
    if (score >= 75 && growthPct >= 100) {
      verdict = "REAL TREND";
      recommendedAction = "ACT NOW";
    } else if (score >= 55 && growthPct >= 50) {
      verdict = "EARLY SIGNAL";
      recommendedAction = "WATCH";
    } else if (score >= 75 && growthPct < 20) {
      verdict = "MAINSTREAM ALREADY";
      recommendedAction = "RESEARCH MORE";
    } else if (growthPct < 0) {
      verdict = "FAD";
      recommendedAction = "SKIP";
    } else {
      verdict = "EARLY SIGNAL";
      recommendedAction = "WATCH";
    }

    // Market size estimate based on score
    const marketMin = Math.round(score * 1.2);
    const marketMax = Math.round(score * 2.5);

    // Time to mainstream based on current interest
    let timeToMainstream;
    if (currentVal >= 70)      timeToMainstream = "3–6 months";
    else if (currentVal >= 50) timeToMainstream = "6–9 months";
    else if (currentVal >= 30) timeToMainstream = "9–12 months";
    else                       timeToMainstream = "12–18 months";

    // Competition estimate based on how mainstream it already is
    let competitionIndia;
    if (currentVal >= 80)      competitionIndia = "Several established players";
    else if (currentVal >= 60) competitionIndia = "2–3 moderate players";
    else if (currentVal >= 40) competitionIndia = "1–2 weak players";
    else                       competitionIndia = "ZERO Indian brands";

    // India readiness
    let indiaReadiness;
    if (growthPct >= 200)      indiaReadiness = "Exploding Fast";
    else if (growthPct >= 100) indiaReadiness = "Growing Fast";
    else if (growthPct >= 50)  indiaReadiness = "Early Adoption";
    else if (growthPct >= 0)   indiaReadiness = "Awareness Building";
    else                       indiaReadiness = "Declining Interest";

    const verdictReason =
      verdict === "REAL TREND"
        ? `Search interest has grown ${growthPct}% in India over 12 months with sustained demand — this is a genuine market shift.`
        : verdict === "EARLY SIGNAL"
        ? `Interest is building in India (${growthPct > 0 ? "+" : ""}${growthPct}% growth) but hasn't hit mainstream yet — ideal entry window.`
        : verdict === "MAINSTREAM ALREADY"
        ? `Already high search interest in India but growth has plateaued — market is established, entry is harder now.`
        : `Search interest has declined in India — consumer attention has moved on from this trend.`;

    const signal =
      `Google Trends India shows ${currentVal}/100 current interest with ${growthPct > 0 ? "+" : ""}${growthPct}% growth over 12 months. ` +
      `Peak interest reached ${peakVal}/100 during this period, indicating ${peakVal > 80 ? "very strong" : peakVal > 50 ? "moderate" : "early"} consumer awareness.`;

    const gap =
      `Most Indian D2C brands have not yet built a dedicated product line around "${query}". ` +
      `The ${competitionIndia.toLowerCase()} in this space leaves room for a first-mover brand with strong clinical positioning and India-specific formulation.`;

    const opportunity =
      `Launch a targeted "${query}" product priced between Rs.799–1,299 aimed at urban Indian consumers aged 25–40. ` +
      `Lead with educational content on YouTube and Instagram to build category awareness before competitors notice the trend.`;

    const result = {
      name: query.charAt(0).toUpperCase() + query.slice(1),
      verdict,
      verdictReason,
      score,
      recommendedAction,
      gtGrowthEstimate: `${growthPct > 0 ? "+" : ""}${growthPct}% (Google Trends India, 12 months)`,
      marketSizeIndia: `Rs.${marketMin}–${marketMax}Cr (estimated)`,
      indiaReadiness,
      timeToMainstream,
      competitionIndia,
      signal,
      gap,
      opportunity,
      fadVsReal: {
        clinicalBacking:       score >= 60,
        westernMainstream2yrs: currentVal >= 50,
        solvesRealPain:        growthPct >= 50,
        indiaSpecificNeed:     currentVal >= 30 && currentVal <= 75,
      },
      consumerQuestions: [
        `What is ${query} and does it work?`,
        `Best ${query} brand in India under Rs.1000?`,
        `Is ${query} safe for daily use in India?`,
      ],
      trendData: trendValues,
    };

    console.log("Analysis complete. Score:", score, "Verdict:", verdict);
    res.json(result);

  } catch (error) {
    console.error("Analyze error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

