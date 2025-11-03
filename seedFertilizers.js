import mongoose from "mongoose";
import { Fertilizer } from "./src/models/fertilizer.model.js";

import connectDB from "./src/db/index.js";
import dotenv from "dotenv"

await connectDB()

dotenv.config();

const fertilizers = [
  {
    name: "Urea",
    forCrops: ["Wheat", "Rice", "Maize"],
    problem: ["Nitrogen deficiency", "Stunted growth", "Yellow leaves"],
    tips: "Apply during active growth stages; avoid overuse to prevent soil damage."
  },
  {
    name: "DAP (Di-Ammonium Phosphate)",
    forCrops: ["Wheat", "Rice", "Sugarcane", "Maize"],
    problem: ["Phosphorus deficiency", "Poor root growth"],
    tips: "Use at sowing time for best results; mix properly with soil."
  },
  {
    name: "MOP (Muriate of Potash)",
    forCrops: ["Cotton", "Sugarcane", "Rice", "Maize"],
    problem: ["Potassium deficiency", "Weak stems", "Poor disease resistance"],
    tips: "Apply during mid-growth; avoid excess in saline soils."
  },
  {
    name: "Super Phosphate",
    forCrops: ["Pulses", "Oilseeds", "Wheat"],
    problem: ["Phosphorus deficiency", "Slow plant growth"],
    tips: "Incorporate into soil before sowing for better root absorption."
  },
  {
    name: "Zinc Sulphate",
    forCrops: ["Rice", "Maize", "Sugarcane", "Pulses"],
    problem: ["Zinc deficiency", "Yellowing of leaves"],
    tips: "Apply 25–30 kg/ha; mix with organic manure for better uptake."
  },
  {
    name: "Gypsum",
    forCrops: ["Groundnut", "Sugarcane", "Oilseeds"],
    problem: ["Calcium deficiency", "Soil salinity"],
    tips: "Improves soil structure and provides sulfur; apply before irrigation."
  },
  {
    name: "Organic Compost",
    forCrops: ["All crops"],
    problem: ["Poor soil fertility"],
    tips: "Enhances soil health naturally; apply regularly to maintain fertility."
  },
  {
    name: "Vermicompost",
    forCrops: ["Vegetables", "Fruits", "Cereals"],
    problem: ["Low organic content", "Poor water retention"],
    tips: "Rich in nutrients; apply 2–3 tons/acre before sowing."
  },
  {
    name: "Neem Cake",
    forCrops: ["Rice", "Wheat", "Vegetables"],
    problem: ["Soil pests", "Nematode attacks"],
    tips: "Acts as natural pesticide; mix with soil during land preparation."
  },
  {
    name: "Biofertilizer (Rhizobium)",
    forCrops: ["Pulses", "Legumes"],
    problem: ["Low nitrogen fixation"],
    tips: "Treat seeds before sowing; improves nitrogen availability in soil."
  }
];

const seedFertilizers = async () => {
  try {
   await Fertilizer.deleteMany();
   await Fertilizer.insertMany(fertilizers)
   console.log("fertilizer seeded successfully")
   process.exit()
  } catch (error) {
    console.error("❌ Error seeding fertilizers:", error);
    process.exit(1)
  }
};

seedFertilizers();