import { ProposalCategory } from "@/types/proposal";
import { cn } from "@/lib/utils";
import { BarChart3, FileText, Users, Lightbulb } from "lucide-react";

interface CategoryFilterProps {
  selected: ProposalCategory | "All";
  onSelect: (category: ProposalCategory | "All") => void;
}

const categories: { value: ProposalCategory | "All"; label: string; icon?: React.ReactNode }[] = [
  { value: "All", label: "All Sections" },
  { value: "Methodology", label: "Methodology", icon: <BarChart3 className="w-4 h-4" /> },
  { value: "Case Study", label: "Case Study", icon: <FileText className="w-4 h-4" /> },
  { value: "Team", label: "Team", icon: <Users className="w-4 h-4" /> },
  { value: "Approach", label: "Approach", icon: <Lightbulb className="w-4 h-4" /> },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
            selected === cat.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {cat.icon}
          {cat.label}
        </button>
      ))}
    </div>
  );
}
