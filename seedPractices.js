import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { Practise } from "./src/models/practise.model.js";

dotenv.config();
connectDB();

const practices = [
  {
    title: "Plant Organic Fertilizers",
    description: "Use compost or organic manure instead of chemical fertilizers.",
    points: 10,
    isDaily: true, // ✅ this one is a daily challenge
  },
  {
    title: "Drip Irrigation",
    description: "Install a drip irrigation system to conserve water.",
    points: 15,
    isDaily: true, // ✅ this one too
  },
  {
    title: "Crop Rotation",
    description: "Practice crop rotation to maintain soil fertility.",
    points: 12,
    isDaily: false, // ❌ normal practice only
  },
  {
    title: "Rainwater Harvesting",
    description: "Collect and store rainwater for irrigation purposes.",
    points: 20,
    isDaily: false, // ❌ normal practice
  },
];

const seedPractices = async () => {
  try {
    await Practise.deleteMany();
    await Practise.insertMany(practices);
    console.log("Practices seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedPractices();
