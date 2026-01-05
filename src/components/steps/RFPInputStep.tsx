import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sampleRFP } from "@/data/proposalSections";
import { FileText, Upload, ArrowRight } from "lucide-react";

interface RFPInputStepProps {
  onSubmit: (text: string) => void;
}

export function RFPInputStep({ onSubmit }: RFPInputStepProps) {
  const [text, setText] = useState("");

  const handleLoadSample = () => {
    setText(sampleRFP);
  };

  const handleSubmit = () => {
    if (text.trim().length >= 50) {
      onSubmit(text);
    }
  };

  const charCount = text.length;
  const isValid = charCount >= 50;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero mb-4 shadow-lg">
          <FileText className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Paste Your RFP Text
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Paste the requirements from your RFP document. Our AI will analyze it and match 
          relevant content from your proposal library.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-foreground">
            RFP Requirements
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSample}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Load Sample RFP
          </Button>
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the RFP requirements here. Include as much detail as possible for better AI matching..."
          className="min-h-[300px] resize-none text-base leading-relaxed"
        />

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            <span className={charCount >= 50 ? "text-success" : "text-muted-foreground"}>
              {charCount.toLocaleString()}
            </span>
            {" "}characters
            {charCount < 50 && (
              <span className="text-warning ml-2">(minimum 50 required)</span>
            )}
          </div>

          <Button
            variant="accent"
            size="lg"
            onClick={handleSubmit}
            disabled={!isValid}
            className="group"
          >
            Analyze RFP
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Include All Requirements", desc: "Paste complete scope, timeline, and qualification requirements" },
          { title: "Be Specific", desc: "The more detail you provide, the better the AI matching" },
          { title: "Multiple Sources OK", desc: "You can combine text from different parts of the RFP" },
        ].map((tip) => (
          <div
            key={tip.title}
            className="bg-secondary/50 rounded-lg p-4 text-sm"
          >
            <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
            <p className="text-muted-foreground">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
