
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client using the environment variable.
// ALWAYS use a named parameter and the exact environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Generates a summary or suggestions for a booking based on user notes.
   */
  async analyzeBookingNotes(notes: string) {
    if (!notes) return "No notes provided.";
    
    try {
      // Use gemini-3-flash-preview for basic text tasks like summarization.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these booking notes and provide a professional summary and any prep suggestions for the staff: "${notes}"`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      // Extract text directly from the response object's .text property.
      return response.text || "Could not analyze notes.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI Assistant is currently unavailable.";
    }
  },

  /**
   * Suggests the best service for a user based on their description of needs.
   */
  async suggestService(needs: string, availableServices: any[]) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the user's need: "${needs}", suggest the most appropriate service from this list: ${JSON.stringify(availableServices)}. Provide a brief reasoning.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              serviceId: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            },
            required: ["serviceId", "reasoning"]
          }
        }
      });
      // Access the generated text content via the .text property.
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Suggestion Error:", error);
      return null;
    }
  }
};
