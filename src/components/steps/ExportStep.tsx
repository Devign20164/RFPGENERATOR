import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GeneratedProposal } from "@/types/proposal";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Plus, 
  CheckCircle,
  Edit3,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface ExportStepProps {
  proposal: GeneratedProposal;
  onRegenerate: () => void;
  onStartOver: () => void;
}

export function ExportStep({ proposal, onRegenerate, onStartOver }: ExportStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(proposal.content);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    // Create a simple PDF-like HTML for download
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${proposal.title}</title>
  <style>
    body {
      font-family: Georgia, serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 60px 40px;
      color: #1a1a2e;
      line-height: 1.8;
    }
    .cover {
      text-align: center;
      padding: 100px 0;
      border-bottom: 2px solid #1e3a5f;
      margin-bottom: 60px;
    }
    .cover h1 {
      font-size: 32px;
      color: #1e3a5f;
      margin-bottom: 20px;
    }
    .cover p {
      color: #666;
      font-size: 16px;
    }
    h2 {
      color: #1e3a5f;
      font-size: 24px;
      margin-top: 40px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    p {
      margin-bottom: 16px;
    }
    strong {
      color: #1e3a5f;
    }
    ul, ol {
      margin-bottom: 16px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Proposal for ${proposal.clientName}</h1>
    <p>Prepared by Research Solutions Inc.</p>
    <p>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  ${content.replace(/## (.*)/g, '<h2>$1</h2>')
           .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
           .replace(/- (.*)/g, '<li>$1</li>')
           .replace(/\n\n/g, '</p><p>')
           .replace(/^/, '<p>')
           .replace(/$/, '</p>')}
</body>
</html>`;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'proposal-draft.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Proposal downloaded!", {
      description: "Open the HTML file in your browser and print to PDF for best results."
    });
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerText);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Proposal is Ready!
        </h2>
        <p className="text-muted-foreground">
          Review, edit, and export your generated proposal
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Preview Mode
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Mode
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onRegenerate}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
        <Button variant="accent" onClick={handleExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          Export to PDF
        </Button>
      </div>

      {/* Proposal Preview/Editor */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        {/* Document Header */}
        <div className="gradient-hero p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            {proposal.title}
          </h1>
          <p className="text-primary-foreground/80">
            Prepared {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Document Content */}
        <div className="p-8 md:p-12">
          {isEditing ? (
            <div
              ref={editorRef}
              contentEditable
              onInput={handleContentChange}
              className="prose prose-slate max-w-none focus:outline-none min-h-[500px] whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: content.replace(/## (.*)/g, '<h2 class="text-xl font-semibold text-primary mt-8 mb-4 pb-2 border-b border-border">$1</h2>').replace(/\n\n/g, '<br/><br/>') }}
            />
          ) : (
            <div className="prose prose-slate max-w-none">
              {proposal.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl font-semibold text-primary mt-8 mb-4 pb-2 border-b border-border">
                    {section.title}
                  </h2>
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" onClick={onStartOver}>
          <Plus className="w-4 h-4 mr-2" />
          Create Another Proposal
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-secondary/50 rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-3">Tips for Finalizing</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Review all sections for accuracy and relevance to this specific RFP</li>
          <li>• Add specific pricing details in the Investment section</li>
          <li>• Customize team member assignments for this project</li>
          <li>• Ensure timeline aligns with RFP requirements</li>
        </ul>
      </div>
    </div>
  );
}
