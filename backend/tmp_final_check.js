import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const getGeminiApiKey = () =>
  process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || "";

const getGenAI = () => new GoogleGenerativeAI(getGeminiApiKey());

async function testChat() {
  const key = getGeminiApiKey();
  console.log("Using Key (first 5):", key.substring(0, 5));
  
  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("Calling gemini-2.5-flash...");
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log("Success with 2.5-flash:", response.text().substring(0, 50));
  } catch (error) {
    console.error("2.5-flash Error:", error.message);
    
    try {
        console.log("Falling back as a test to gemini-pro...");
        const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("Success with gemini-pro:", response.text().substring(0, 50));
    } catch (e2) {
        console.error("gemini-pro also failed:", e2.message);
    }
  }
}

testChat();
