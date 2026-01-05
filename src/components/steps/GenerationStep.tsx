import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { proposalSections } from "@/data/proposalSections";
import { GeneratedProposal } from "@/types/proposal";
import { ArrowLeft, FileText, Clock, Sparkles } from "lucide-react";

interface GenerationStepProps {
  rfpText: string;
  selectedSections: string[];
  onComplete: (proposal: GeneratedProposal) => void;
  onBack: () => void;
}

// Generate proposal locally - in production this would use AI
function generateProposal(rfpText: string, selectedSectionIds: string[]): GeneratedProposal {
  const selectedSectionsData = proposalSections.filter(s => selectedSectionIds.includes(s.id));
  
  // Extract client name from RFP
  const clientMatch = rfpText.match(/city of (\w+)|(\w+) county|(\w+) seeks/i);
  const clientName = clientMatch ? clientMatch[1] || clientMatch[2] || clientMatch[3] : "Client";

  // Build proposal sections
  const sections = [
    {
      title: "Executive Summary",
      content: `We are pleased to submit this proposal in response to your request for research services. Our firm brings over two decades of experience in conducting rigorous, methodologically sound research for government clients. We understand the importance of this project and are committed to delivering actionable insights that will inform your decision-making process.

Our approach combines proven research methodologies with deep experience serving municipal clients. We have assembled a team of senior researchers who specialize in public opinion research and have successfully completed similar engagements for government entities across the region.

This proposal outlines our recommended methodology, team qualifications, timeline, and investment. We are confident that our approach will deliver the insights you need within your required timeframe and budget.`,
    },
  ];

  // Add methodology sections
  const methodologySections = selectedSectionsData.filter(s => s.category === "Methodology");
  if (methodologySections.length > 0) {
    sections.push({
      title: "Methodology",
      content: methodologySections.map(s => s.content).join("\n\n"),
    });
  }

  // Add approach sections
  const approachSections = selectedSectionsData.filter(s => s.category === "Approach");
  if (approachSections.length > 0) {
    sections.push({
      title: "Our Approach",
      content: approachSections.map(s => s.content).join("\n\n"),
    });
  }

  // Add case studies
  const caseSections = selectedSectionsData.filter(s => s.category === "Case Study");
  if (caseSections.length > 0) {
    sections.push({
      title: "Relevant Experience",
      content: caseSections.map(s => s.content).join("\n\n"),
    });
  }

  // Add team qualifications
  const teamSections = selectedSectionsData.filter(s => s.category === "Team");
  if (teamSections.length > 0) {
    sections.push({
      title: "Team Qualifications",
      content: teamSections.map(s => s.content).join("\n\n"),
    });
  }

  // Add timeline section
  sections.push({
    title: "Project Timeline",
    content: `Based on your requirements, we propose the following timeline:

**Week 1: Project Initiation**
- Kickoff meeting and requirements confirmation
- Survey instrument development
- Sample design and procurement

**Week 2: Data Collection**
- Interviewing period
- Daily quality monitoring
- Client status updates

**Week 3: Analysis & Reporting**
- Data processing and weighting
- Statistical analysis
- Report preparation

**Delivery: End of Week 3**
- Final report with executive summary
- Detailed cross-tabulations
- Presentation to stakeholders (optional)`,
  });

  // Add pricing section
  sections.push({
    title: "Investment",
    content: `Our proposed investment for this engagement reflects our commitment to delivering high-quality research within your budget parameters. The fee includes all aspects of research design, data collection, analysis, and reporting.

**Professional Fees**
- Research design and consultation: Included
- Survey administration: Included
- Data analysis and reporting: Included
- Final presentation: Included

We offer flexible payment terms and can discuss alternative scope configurations to meet specific budget requirements. All pricing is valid for 90 days from the date of this proposal.

*Note: Specific pricing details to be provided based on final scope confirmation.*`,
  });

  return {
    title: `Research Proposal for ${clientName}`,
    clientName,
    content: sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n"),
    sections,
  };
}

export function GenerationStep({ rfpText, selectedSections, onComplete, onBack }: GenerationStepProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const statuses = [
      { progress: 10, text: "Analyzing RFP requirements..." },
      { progress: 30, text: "Matching content from library..." },
      { progress: 50, text: "Generating executive summary..." },
      { progress: 70, text: "Assembling proposal sections..." },
      { progress: 90, text: "Finalizing document..." },
      { progress: 100, text: "Complete!" },
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < statuses.length) {
        setProgress(statuses[currentIndex].progress);
        setStatus(statuses[currentIndex].text);
        currentIndex++;
      } else {
        clearInterval(interval);
        // Generate and complete
        const proposal = generateProposal(rfpText, selectedSections);
        setTimeout(() => {
          onComplete(proposal);
        }, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [rfpText, selectedSections, onComplete]);

  return (
    <div className="animate-fade-in text-center py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero mb-6 shadow-lg relative overflow-hidden">
        <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 animate-shimmer" 
             style={{ transform: `translateX(-100%)` }} />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-4">
        Generating Your Proposal
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Our AI is crafting a professional proposal tailored to your RFP requirements.
      </p>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{status}</span>
          <span className="text-foreground font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{selectedSections.length} sections</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>~15 seconds</span>
        </div>
      </div>

      <div className="mt-12">
        <Button variant="ghost" onClick={onBack} disabled={isGenerating}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>
      </div>
    </div>
  );
}
