import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from '../models/user.model.js'
import  jwt from 'jsonwebtoken'
import twilio from "twilio"
import fast2sms from "fast-two-sms"
const generateAccessAndRefereshTokens = async (userId) => {
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsappOtp = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from : "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:91${phoneNumber}`  // Farmer's WhatsApp number
    });
  } catch (err) {
    console.error("Error sending WhatsApp OTP:", err);
    throw new Error("Could not send OTP via WhatsApp");
  }
};

// const sendSmsOtp = async (phoneNumber,otp) => {
//     try {
//         const response = await fast2sms.sendMessage({
//              authorization: process.env.FAST2SMS_API_KEY,
//       message: `Your OTP for registration is: ${otp}`,
//       numbers: [phoneNumber],
//         })
        
//     console.log("SMS OTP sent:", response);
//     } catch (err) {
//         console.error("Error sending SMS OTP:", err);
//     throw new Error("Could not send OTP via SMS");
//     }
// }

const demoLogin = asyncHandler(async(req,res) => {
    const demoEmail = "demo@gmail.com";

    let user = await User.findOne({ email:demoEmail})

    if(!user) {
        user = await User.create({
            fullName:"Demo User",
            email:demoEmail,
            password:"Demo@123",
            phoneNumber:"9999999999",
            phoneVerified: true,
            subscription:"vip"
        })
    }
     const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const demoUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: demoUser }, "Demo login successful")
    );
})

const registerUser = asyncHandler(async(req,res)=>{
    const{fullName,email,password,phoneNumber} = req.body
    
    if (!fullName || !email || !phoneNumber || !password) {
        throw new ApiError(400, "Full name and either email or phone number required");
    }

    const existedUser = await User.findOne({
        $or: [{email},{phoneNumber}]
    })

    if(existedUser){
        throw new ApiError(400,"User with email or phoneNumber already exist")
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
   // Send OTP via WhatsApp
await sendWhatsappOtp(phoneNumber, otp);

// await sendSmsOtp(phoneNumber,otp)

    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        phoneOTP : otp,
        otpExpiry,
        phoneVerified : false
        
    })
     // TODO: send OTP via WhatsApp/SMS here
  console.log(`OTP for ${phoneNumber}: ${otp}`);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})
const verifyPhone = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) throw new ApiError(400, "User ID and OTP required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.phoneVerified) throw new ApiError(400, "Phone already verified");

  if (user.phoneOTP !== otp) throw new ApiError(400, "Invalid OTP");
  if (user.otpExpiry < new Date()) throw new ApiError(400, "OTP expired");

  user.phoneVerified = true;
  user.phoneOTP = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Phone verified, registration complete"));
});


const loginUser = asyncHandler(async(req,res)=>{
    const {email,password,phoneNumber} = req.body

    if(!(email || phoneNumber)){
        throw new ApiError(400,"email/phoneNumber is req")
    }

    const user = await User.findOne({
        $or :[{email},{phoneNumber}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    if (!user.phoneVerified) throw new ApiError(400, "Phone not verified");

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password Incorrect")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    const loginUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure:false,
        sameSite: 'lax',
         maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loginUser,accessToken,refreshToken
            }
        )
    )
})

const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged out")
    )
})
const getCurrentUser = asyncHandler(async (req, res) => {
  // Always fetch the fresh user from DB
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "current user fetched"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) throw new ApiError(401, "Unauthorized request");

    // 1️⃣ Verify the token without changing DB
    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(401, "User not found");

    // 2️⃣ Compare incoming token with DB before overwriting
    if (incomingToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used");
    }

    // 3️⃣ Now generate new tokens and save new refresh token
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const options = { httpOnly: true, secure: false , sameSite:'lax'};

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            )
        );
});



export {
    loginUser,
    registerUser,
    logout,
    refreshAccessToken,
    verifyPhone,
    getCurrentUser,
    demoLogin
}