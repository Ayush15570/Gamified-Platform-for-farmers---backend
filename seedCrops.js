import mongoose from "mongoose";
import dotenv from "dotenv";
import { Crop } from "./src/models/crop.model.js";
import connectDB from "./src/db/index.js";


dotenv.config();
connectDB()
const crops = [
  {
    name: "Rice",
    landType: ["Clayey", "Loamy"],
    waterNeeds: ["High"],
    season: ["Kharif"],
    tips: "Requires continuous water supply and warm climate.",
    suitableStates: ["West Bengal", "Bihar", "Uttar Pradesh", "Punjab"]
  },
  {
    name: "Wheat",
    landType: ["Loamy", "Clay loam"],
    waterNeeds: ["Medium"],
    season: ["Rabi"],
    tips: "Requires cool weather and moderate irrigation.",
    suitableStates: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"]
  },
  {
    name: "Maize",
    landType: ["Well-drained loamy"],
    waterNeeds: ["Medium"],
    season: ["Kharif", "Rabi"],
    tips: "Avoid waterlogging and provide adequate sunlight.",
    suitableStates: ["Bihar", "Madhya Pradesh", "Karnataka", "Maharashtra"]
  },
  {
    name: "Sugarcane",
    landType: ["Loamy", "Alluvial"],
    waterNeeds: ["High"],
    season: ["Annual"],
    tips: "Needs plenty of sunlight and regular irrigation.",
    suitableStates: ["Uttar Pradesh", "Maharashtra", "Tamil Nadu", "Bihar"]
  },
  {
    name: "Cotton",
    landType: ["Black soil", "Well-drained loam"],
    waterNeeds: ["Medium"],
    season: ["Kharif"],
    tips: "Requires warm conditions and good drainage.",
    suitableStates: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Telangana"]
  }
];

const seedCrops = async () => {
  try {
   await Crop.deleteMany();
   await Crop.insertMany(crops)
   console.log("Crops seeded successfully")
   process.exit()


   
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

seedCrops();
