import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))


import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)

import practiceRouter from "./routes/practice.router.js"

app.use("/api/v1/practice",practiceRouter)


import admin from "./routes/admin.router.js"

app.use("/api/v1/admin",admin)

import leaderboardRouter from "./routes/leaderboard.router.js";
app.use("/api/v1/leaderboard", leaderboardRouter);

import recommendation from "./routes/crop_fertilizer.router.js"
app.use("/api/v1/recommendation",recommendation)

import crop from "./routes/cropIssue.router.js"
app.use("/api/v1/crop",crop)

import challenge from "./routes/dailyChallenge.route.js"
app.use("/api/v1/challenge",challenge)
export default app