
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInventoryInsights = async (products: Product[]) => {
  try {
    const productsContext = products.map(p => 
      `${p.name} (SKU: ${p.sku}) - Stock: ${p.totalStock}, Status: ${p.status}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following inventory data, provide 3 short, actionable bullet points for the manager. 
      Focus on critical restock needs or interesting patterns. Keep it professional and concise.
      
      Inventory Data:
      ${productsContext}`,
      config: {
        systemInstruction: "You are a professional supply chain analyst specializing in appliance retail.",
        temperature: 0.7,
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Error connecting to AI advisor. Please try again later.";
  }
};
