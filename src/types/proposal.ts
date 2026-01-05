export type ProposalCategory = "Methodology" | "Case Study" | "Team" | "Approach";

export interface ProposalSection {
  id: string;
  title: string;
  category: ProposalCategory;
  content: string;
  preview: string;
}

export interface RFPRequirement {
  id: string;
  text: string;
  matchedSections: string[];
  isGap: boolean;
}

export interface AnalysisResult {
  requirements: RFPRequirement[];
  suggestedSections: string[];
  gaps: string[];
}

export interface GeneratedProposal {
  title: string;
  clientName: string;
  content: string;
  sections: {
    title: string;
    content: string;
  }[];
}
