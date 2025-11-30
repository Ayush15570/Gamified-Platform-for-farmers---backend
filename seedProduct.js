
import dotenv from "dotenv";
import { DigitalProduct } from "./src/models/digialProduct.model.js";
import connectDB from "./src/db/index.js";


dotenv.config();
connectDB()
const products = [
  {
  "title": "Crop Care eBook",
  "description": "Improve your crop yield with smart techniques.",
  "pointsCost": 50,
  "fileUrl": "https://example.com/cropcare.pdf",
  "type": "ebook"
 },
 {
  "title": "Crop Care eBook",
  "description": "A complete guide on improving crop yield using smart techniques.",
  "pointsCost": 40,
  "fileUrl": "/products/crop-care-ebook.pdf",
  "type": "ebook"
 },
{
  "title": "Smart Irrigation Guide",
  "description": "Learn water-saving irrigation methods and drip techniques.",
  "pointsCost": 35,
  "fileUrl": "/products/smart-irrigation.pdf",
  "type": "ebook"
},
{
  "title": "Fertilizer Optimization Chart",
  "description": "Perfect dosage charts for different soil and crop types.",
  "pointsCost": 25,
  "fileUrl": "/products/fertilizer-chart.png",
  "type": "chart"
},
{
  "title": "Organic Farming Starter Kit",
  "description": "Basics of switching to organic farming.",
  "pointsCost": 55,
  "fileUrl": "/products/organic-farming.pdf",
  "type": "ebook"
},
{
  "title": "Soil Health Improvement PDF",
  "description": "Improve soil fertility and long-term sustainability.",
  "pointsCost": 30,
  "fileUrl": "/products/soil-health.pdf",
  "type": "ebook"
},
{
  "title": "Pest Identification Guide",
  "description": "Identify common pests and natural ways to control them.",
  "pointsCost": 20,
  "fileUrl": "/products/pest-guide.pdf",
  "type": "ebook"
},
{
  "title": "Weather Prediction Tips (Video)",
  "description": "Learn how to predict weather using natural signs.",
  "pointsCost": 35,
  "fileUrl": "/products/weather-tips.mp4",
  "type": "video"
},
{
  "title": "Seasonal Crop Planner",
  "description": "Best crops to grow in each season with yield expectations.",
  "pointsCost": 30,
  "fileUrl": "/products/crop-planner.pdf",
  "type": "tool"
},










];

const seedProducts = async () => {
  try {
   await DigitalProduct.deleteMany();
   await DigitalProduct.insertMany(products)
   console.log("products seeded successfully")
   process.exit()


   
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

seedProducts();
