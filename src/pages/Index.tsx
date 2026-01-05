import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ProposalCard } from "@/components/ProposalCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { proposalSections } from "@/data/proposalSections";
import { ProposalCategory } from "@/types/proposal";
import { Sparkles, Clock, Zap, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<ProposalCategory | "All">("All");

  const filteredSections = selectedCategory === "All"
    ? proposalSections
    : proposalSections.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
        <div className="container py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Proposal Generation
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              From RFP to Proposal in{" "}
              <span className="text-accent">45 Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your proposal writing process. Our AI analyzes RFP requirements, 
              matches relevant content from your library, and generates professional proposals 
              tailored to each opportunity.
            </p>
            <Button
              variant="accent"
              size="xl"
              onClick={() => navigate("/create")}
              className="group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Create New Proposal
            </Button>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Clock, label: "Average Time Saved", value: "3+ Hours" },
                { icon: TrendingUp, label: "Proposals Generated", value: "200+/Year" },
                { icon: Zap, label: "Time Reduction", value: "85%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl p-6 shadow-card border border-border/50"
                >
                  <stat.icon className="w-8 h-8 text-accent mb-3 mx-auto" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proposal Library Section */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Proposal Content Library
            </h2>
            <p className="text-muted-foreground">
              Pre-approved sections ready for AI matching and assembly
            </p>
          </div>
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSections.map((section, index) => (
            <div
              key={section.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <ProposalCard section={section} />
            </div>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No sections found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Proposal Process?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Start by pasting your RFP text and let our AI do the heavy lifting.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/create")}
              className="shadow-lg"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
