import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || "");

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Gemini Pro works!");
  } catch (error) {
    console.error("Gemini 1.5 Flash failed:", error.message);
  }

  try {
    const list = await genAI.getGenerativeModel({ model: "models/gemini-2.5-flash-lite" });
    // This is not how you list models, but let's try another one.
  } catch (e) {}
}

listModels();
