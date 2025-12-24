
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const contentTools = {
  articleWriter: async (topic: string, length: 'short' | 'medium' | 'long') => {
    return ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a ${length} article about: ${topic}. Format with markdown headers.`,
    });
  },
  
  blogTitleGenerator: async (keywords: string) => {
    return ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 10 catchy blog titles for keywords: ${keywords}`,
    });
  },

  resumeReview: async (resumeText: string) => {
    return ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as an expert ATS (Applicant Tracking System) reviewer. Analyze this resume for impact, skill match, and clarity. Provide actionable feedback. Resume: ${resumeText}`,
    });
  }
};

export const contactTools = {
  processMessage: async (name: string, email: string, message: string) => {
    return ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Zera AI support agent. A user named ${name} (${email}) sent this message: "${message}". Generate a concise, professional 2-sentence confirmation acknowledging their specific concern and letting them know a human agent from our Bhubaneswar HQ will follow up if needed.`,
    });
  }
};

export const designTools = {
  generateImage: async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio }
      }
    });
    
    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  },

  editImage: async (base64Image: string, prompt: string, mimeType: string = 'image/png') => {
    // Extract base64 data by removing data:image/...;base64, prefix
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      }
    });

    let imageUrl = '';
    // Corrected path: response.candidates[0].content.parts
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return imageUrl;
  }
};
