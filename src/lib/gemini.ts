import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, RFPRequirement } from "@/types/proposal";
import { proposalSections } from "@/data/proposalSections";

// Access the API key from Vite environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function analyzeRFPWithGemini(rfpText: string): Promise<AnalysisResult> {
    if (!API_KEY) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use specific model as requested
    const modelNames = ["gemini-2.5-flash"];
    let lastError;

    const prompt = `
    You are an expert proposal manager. Your task is to analyze the following Request for Proposal (RFP) text and extract the key requirements.
    
    For each requirement you find:
    1. Extract the text of the requirement.
    2. Since we are custom-writing this proposal, mark every requirement as a "gap" (isGap: true) because we are not matching against a pre-defined library.
    3. matchedSections should be an empty array.

    Here is the RFP Text:
    "${rfpText}"

    Output the result as a STRICT JSON object with the following confirmed structure (do not include markdown code blocks like \`\`\`json):
    {
      "requirements": [
        {
          "id": "req-1",
          "text": "Description of the requirement found in the RFP",
          "matchedSections": [],
          "isGap": true
        }
      ],
      "suggestedSections": [],
      "gaps": ["Description of gap 1", "Description of gap 2"]
    }
  `;

    for (const modelName of modelNames) {
        try {
            console.log(`Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up any potential markdown formatting from the response
            const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();

            const parsed: AnalysisResult = JSON.parse(cleanJson);
            return parsed;
        } catch (error: any) {
            console.warn(`Failed with model ${modelName}:`, error);
            lastError = error;
            // If it's not a 404 (Not Found), it might be a legitimate other error (quota, etc), so maybe we shouldn't continue?
            // But for now, let's assume 404s are the main issue and try others.
            if (!error.message?.includes("404") && !error.message?.includes("not found")) {
                // breaks if it's a different kind of error
            }
        }
    }

    console.error("All model attempts failed.");
    throw new Error(`Failed to generate content. Attempted models: ${modelNames.join(", ")}. Last error: ${lastError?.message || "Unknown"}`);
}
