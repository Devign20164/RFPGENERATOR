import { RFPRequirement } from "@/types/proposal";
import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequirementItemProps {
  requirement: RFPRequirement;
}

export function RequirementItem({ requirement }: RequirementItemProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        requirement.isGap
          ? "border-warning/50 bg-warning/5"
          : "border-success/50 bg-success/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
            requirement.isGap ? "bg-warning/20" : "bg-success/20"
          )}
        >
          {requirement.isGap ? (
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          ) : (
            <Check className="w-3.5 h-3.5 text-success" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{requirement.text}</p>
          {requirement.matchedSections.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {requirement.matchedSections.map((section) => (
                <span
                  key={section}
                  className="text-xs px-2 py-1 rounded-md bg-success/10 text-success"
                >
                  {section}
                </span>
              ))}
            </div>
          )}
          {requirement.isGap && (
            <p className="text-xs text-warning mt-2">
              No matching content found - will need custom writing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
