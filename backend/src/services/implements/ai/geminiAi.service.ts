import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiAIService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  }

  async generateChallengeTasks(input: {
    goal: string;
    level: string;
    duration: number;
    type: string;
  }) {
    const prompt = `
You are a professional health challenge AI generator.

Generate a ${input.duration}-day ${input.type} challenge.

Goal: ${input.goal}
Difficulty Level: ${input.level}

Rules:
- Return ONLY valid JSON array
- No markdown
- No explanations
- Safe, realistic tasks
- Include fitness, nutrition, or mental tasks based on challenge type
- One task per day minimum

Format:
[
  {
    "dayNumber": 1,
    "type": "fitness",
    "title": "Morning Walk",
    "description": "Walk briskly for 20 minutes",
    "unit": "minutes",
    "targetValue": 20,
    "difficulty": "easy",
    "isOptional": false
  }
]
`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanedText);
    } catch (err) {
      console.error("Gemini generation failed:", err);
      return [];
    }
  }
}