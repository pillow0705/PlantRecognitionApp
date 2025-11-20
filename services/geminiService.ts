import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlantIdentificationResult } from "../types";

// Initialize the Gemini client
// The API key is injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PLANT_MODEL = 'gemini-3-pro-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';

// Schema for structured plant data
const plantSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING, description: "The common name of the plant." },
    scientificName: { type: Type.STRING, description: "The scientific Latin name." },
    description: { type: Type.STRING, description: "A brief description of the plant's appearance and origin." },
    care: {
      type: Type.OBJECT,
      properties: {
        water: { type: Type.STRING, description: "Watering frequency and tips." },
        light: { type: Type.STRING, description: "Sunlight requirements (e.g., Full sun, partial shade)." },
        soil: { type: Type.STRING, description: "Preferred soil type and drainage." },
        toxicity: { type: Type.STRING, description: "Toxicity info for pets and children." },
      },
      required: ["water", "light", "soil", "toxicity"],
    },
    funFact: { type: Type.STRING, description: "An interesting fact about this plant." },
  },
  required: ["commonName", "scientificName", "description", "care", "funFact"],
};

/**
 * Identifies a plant from a base64 image string.
 */
export const identifyPlantFromImage = async (base64Image: string): Promise<PlantIdentificationResult> => {
  // Remove data URL prefix if present to get just the base64 data
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  const prompt = "Identify this plant from the image. Provide detailed care instructions and interesting facts.";

  try {
    const response = await ai.models.generateContent({
      model: PLANT_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, but model handles standard types
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: plantSchema,
        // Optional: Use thinking budget for complex identification if needed, 
        // but usually standard inference is enough for clear plant photos.
        // config: { thinkingConfig: { thinkingBudget: 1024 } }
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(response.text) as PlantIdentificationResult;
    return data;
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw error;
  }
};

/**
 * Creates a chat session for general gardening advice.
 */
export const createGardeningChat = () => {
  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: "You are an expert botanist and gardening assistant named GreenThumb. You are helpful, friendly, and concise. Use emojis occasionally to keep the tone light and natural.",
    }
  });
};