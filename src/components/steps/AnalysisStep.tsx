import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RequirementItem } from "@/components/RequirementItem";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { proposalSections } from "@/data/proposalSections";
import { AnalysisResult } from "@/types/proposal";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { analyzeRFPWithGemini } from "@/lib/gemini";

interface AnalysisStepProps {
  rfpText: string;
  onComplete: (result: AnalysisResult, selectedSections: string[]) => void;
  onBack: () => void;
}

export function AnalysisStep({ rfpText, onComplete, onBack }: AnalysisStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function performAnalysis() {
      try {
        setIsAnalyzing(true);
        setError(null);
        const analysisResult = await analyzeRFPWithGemini(rfpText);

        if (mounted) {
          setResult(analysisResult);
          setSelectedSections(analysisResult.suggestedSections);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError("Failed to analyze RFP with AI. Please check your API key or connection.");
        }
      } finally {
        if (mounted) {
          setIsAnalyzing(false);
        }
      }
    }

    performAnalysis();

    return () => {
      mounted = false;
    };
  }, [rfpText]);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleContinue = () => {
    if (result) {
      onComplete(result, selectedSections);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="animate-fade-in text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-accent mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-accent-foreground animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Analyzing Your RFP...
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Our AI is extracting requirements and matching them to your content library.
        </p>
        <LoadingSpinner size="lg" className="mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-destructive/10 mb-6 shadow-lg">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Analysis Failed
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {error}
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!result) return null;

  const matchedCount = result.requirements.filter(r => !r.isGap).length;
  const gapCount = result.requirements.filter(r => r.isGap).length;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Analysis Complete
        </h2>
        <p className="text-muted-foreground">
          Found {result.requirements.length} requirements with {matchedCount} matches
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-success/10 rounded-xl p-5 border border-success/20">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-medium text-foreground">Matched</span>
          </div>
          <div className="text-3xl font-bold text-success">{matchedCount}</div>
          <div className="text-sm text-muted-foreground">requirements with content</div>
        </div>
        <div className="bg-warning/10 rounded-xl p-5 border border-warning/20">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="font-medium text-foreground">Gaps</span>
          </div>
          <div className="text-3xl font-bold text-warning">{gapCount}</div>
          <div className="text-sm text-muted-foreground">need custom writing</div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Requirements Found
        </h3>
        <div className="space-y-3">
          {result.requirements.map((req) => (
            <RequirementItem key={req.id} requirement={req} />
          ))}
        </div>
      </div>

      {/* Section Selection */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Suggested Sections to Include
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          These sections will be incorporated into your proposal. Uncheck any you don't want to include.
        </p>
        <div className="space-y-3">
          {proposalSections.map((section) => (
            <label
              key={section.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
            >
              <Checkbox
                checked={selectedSections.includes(section.id)}
                onCheckedChange={() => handleSectionToggle(section.id)}
              />
              <div className="flex-1">
                <span className="font-medium text-foreground">{section.title}</span>
                <span className="text-sm text-muted-foreground ml-2">({section.category})</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to RFP
        </Button>
        <Button
          variant="accent"
          size="lg"
          onClick={handleContinue}
          disabled={selectedSections.length === 0}
        >
          Generate Proposal Draft
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
