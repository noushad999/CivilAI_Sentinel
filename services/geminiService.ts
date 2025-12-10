import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StructuralAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    risk_score: {
      type: Type.NUMBER,
      description: "A calculated risk score from 0 (Safe) to 100 (Critical Failure Imminent).",
    },
    primary_defect: {
      type: Type.STRING,
      description: "The most significant structural defect identified (e.g., 'Shear Crack', 'Spalling', 'Rebar Corrosion').",
    },
    severity: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "Categorical severity of the defect.",
    },
    reasoning_chain: {
      type: Type.STRING,
      description: "A step-by-step forensic engineering analysis detailing observations and logical deductions.",
    },
    recommendation: {
      type: Type.STRING,
      description: "Immediate actionable advice for the site engineer.",
    },
  },
  required: ["risk_score", "primary_defect", "severity", "reasoning_chain", "recommendation"],
};

export const analyzeStructure = async (base64Image: string): Promise<StructuralAnalysis> => {
  try {
    // Strip the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const modelId = 'gemini-3-pro-preview';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          },
          {
            text: "Analyze this structural image as a Forensic Civil Engineer. First, identify the material (Concrete, Brick, Steel). Then, scan for specific distress signs: Shear cracks (45-degree), Corrosion, Spalling, or Settlement. Determine the risk."
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for analytical precision
        systemInstruction: "You are CivilAI Sentinel, a high-precision forensic structural analysis AI. Your output must be technical, objective, and strictly follow civil engineering terminology. Do not hallucinate defects if none are visible. If the image is unclear, note that in the reasoning.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text received from Gemini.");

    const data = JSON.parse(text) as StructuralAnalysis;
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
