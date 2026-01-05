import { ProposalSection, ProposalCategory } from "@/types/proposal";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Lightbulb, BarChart3 } from "lucide-react";

interface ProposalCardProps {
  section: ProposalSection;
  onClick?: () => void;
}

const categoryConfig: Record<ProposalCategory, { variant: "methodology" | "caseStudy" | "team" | "approach"; icon: React.ReactNode }> = {
  Methodology: { variant: "methodology", icon: <BarChart3 className="w-4 h-4" /> },
  "Case Study": { variant: "caseStudy", icon: <FileText className="w-4 h-4" /> },
  Team: { variant: "team", icon: <Users className="w-4 h-4" /> },
  Approach: { variant: "approach", icon: <Lightbulb className="w-4 h-4" /> },
};

export function ProposalCard({ section, onClick }: ProposalCardProps) {
  const config = categoryConfig[section.category];

  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer border border-border/50 hover:border-accent/30 animate-fade-in"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={config.variant} className="flex items-center gap-1.5">
            {config.icon}
            {section.category}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {section.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {section.preview}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-accent" />
        </div>
      </div>
    </div>
  );
}
