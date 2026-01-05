import { useState } from "react";
import { Header } from "@/components/Header";
import { StepIndicator } from "@/components/StepIndicator";
import { RFPInputStep } from "@/components/steps/RFPInputStep";
import { AnalysisStep } from "@/components/steps/AnalysisStep";
import { GenerationStep } from "@/components/steps/GenerationStep";
import { ExportStep } from "@/components/steps/ExportStep";
import { AnalysisResult, GeneratedProposal } from "@/types/proposal";

const steps = [
  { id: 1, title: "RFP Input" },
  { id: 2, title: "Analysis" },
  { id: 3, title: "Generate" },
  { id: 4, title: "Export" },
];

const CreateProposal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [rfpText, setRfpText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);

  const handleRFPSubmit = (text: string) => {
    setRfpText(text);
    setCurrentStep(2);
  };

  const handleAnalysisComplete = (result: AnalysisResult, sections: string[]) => {
    setAnalysisResult(result);
    setSelectedSections(sections);
    setCurrentStep(3);
  };

  const handleGenerationComplete = (proposal: GeneratedProposal) => {
    setGeneratedProposal(proposal);
    setCurrentStep(4);
  };

  const handleRegenerate = () => {
    setCurrentStep(3);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setRfpText("");
    setAnalysisResult(null);
    setSelectedSections([]);
    setGeneratedProposal(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 md:py-12">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <RFPInputStep onSubmit={handleRFPSubmit} />
          )}

          {currentStep === 2 && (
            <AnalysisStep
              rfpText={rfpText}
              onComplete={handleAnalysisComplete}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <GenerationStep
              rfpText={rfpText}
              selectedSections={selectedSections}
              onComplete={handleGenerationComplete}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && generatedProposal && (
            <ExportStep
              proposal={generatedProposal}
              onRegenerate={handleRegenerate}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;
