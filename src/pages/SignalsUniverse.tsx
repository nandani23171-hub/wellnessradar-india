import { useState } from "react";
import { Layout } from "@/components/Layout";
import { signalCategories, allKeywords } from "@/data/signals";
import { Search, TrendingUp } from "lucide-react";

const SignalsUniverse = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredKeywords = allKeywords.filter((kw) => {
    const matchesSearch = kw.keyword.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || kw.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-black text-foreground mb-2">Signals Universe</h1>
        <p className="text-muted-foreground mb-10">
          Everything We Monitor — {allKeywords.length}+ Signals Across {signalCategories.length} Categories
        </p>

        {/* Category Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
          {signalCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`glow-card rounded-xl border p-4 text-left transition-colors ${
                selectedCategory === cat.name
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-foreground">{cat.name}</h3>
                <span className={`text-xs ${cat.tempColor}`}>{cat.temperature}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{cat.keywords} keywords</p>
              <p className="text-xs text-primary mt-1 truncate">🔥 {cat.hottest}</p>
            </button>
          ))}
        </div>

        {/* Search + Table */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear filter: {selectedCategory} ×
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Keyword</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Growth</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Volume</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{kw.keyword}</td>
                    <td className="px-4 py-3 text-muted-foreground">{kw.category}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 font-mono text-success font-bold text-xs">
                        <TrendingUp className="h-3 w-3" /> {kw.growth}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{kw.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredKeywords.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No keywords found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SignalsUniverse;
