import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import OpenAI from "openai";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeCropIssue = asyncHandler(async (req, res) => {
  // ---------------- USER & SUBSCRIPTION CHECK ----------------
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.subscription !== "vip") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "VIP access required"));
  }

  // ---------------- TEXT DESCRIPTION CHECK ----------------
  const { description } = req.body;
  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  // ---------------- IMAGE UPLOAD ----------------
  const imageLocalPath = req?.files?.image?.[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const uploadedImage = await uploadOnCloudinary(imageLocalPath);
  if (!uploadedImage) {
    throw new ApiError(500, "Failed to upload image");
  }

  // ---------------- PROMPT ----------------
  const prompt = `
You are an agricultural expert AI.

RULES:
- Auto-detect user's language (Hindi/English/etc)
- Reply in the SAME language
- Output ONLY JSON
- No extra words outside JSON

Return JSON in this EXACT FORMAT:

{
  "status": "",
  "disease": "",
  "confidence": "",
  "symptoms": [],
  "cause": "",
  "treatment": [],
  "prevention": [],
  "isEmergency": false
}

User Description: "${description}"
Image URL: ${uploadedImage.url}
`;

  // ---------------- OPENAI CALL ----------------
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.4,
  });

  //  PARSE JSON
  const aiText = response.choices[0].message.content;

  // ---------------- ROBUST JSON PARSING ----------------
  let result;
  try {
    result = JSON.parse(aiText);
  } catch (err) {
    console.error("AI JSON parse error:", aiText);

    // Fallback: return minimal info instead of crashing
    result = {
      status: "unknown",
      disease: "unknown",
      confidence: "0",
      symptoms: [],
      cause: "",
      treatment: [],
      prevention: [],
      isEmergency: false,
      note: "AI returned invalid JSON. Check description or image."
    };
  }

  //  FINAL RESPONSE 
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Crop analysis successful"));
});
