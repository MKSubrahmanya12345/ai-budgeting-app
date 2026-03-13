import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const getGeminiApiKey = () =>
  process.env.GEMINI_API_KEY || process.env.GEMINI_KEY || "";

const getModel = () => {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Convert local file to GoogleGenerativeAI.Part object
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

export const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded." });
    }

    const model = getModel();
    const prompt = `
      Analyze this receipt or payment screenshot and extract the transaction details.
      
      Look for:
      1. Merchant name (Who was paid?)
      2. Total Amount (The final amount paid)
      3. Transaction Date (YYYY-MM-DD format. If not found, use today)
      4. Category (One of: Food, Transport, Rent, Utilities, Shopping, Health, Entertainment, Education, Savings, Other)
      5. Type (Is it an "expense" or "income"?)

      Return ONLY a clean JSON object in this format:
      {
        "description": "Merchant Name",
        "amount": 123.45,
        "transactionDate": "YYYY-MM-DD",
        "category": "CategoryName",
        "type": "expense|income",
        "isEssential": true|false,
        "note": "Extracted from receipt"
      }
    `;

    const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean response text to ensure it's valid JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse receipt data. Please try a clearer photo.");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Clean up temporary file
    fs.unlinkSync(req.file.path);

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("OCR Error:", error);
    // Clean up if file exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: "AI failed to read the receipt. " + (error.message || ""), 
      error: error.message 
    });
  }
};
