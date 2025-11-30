import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import fast2sms from "fast-two-sms";

// ------------------------ TOKEN GENERATOR ------------------------
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

// ------------------------ TWILIO SETUP ------------------------
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsappOtp = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: "whatsapp:+14155238886",
      to: `whatsapp:91${phoneNumber}`
    });
  } catch (err) {
    console.error("Error sending WhatsApp OTP:", err);
    throw new Error("Could not send OTP via WhatsApp");
  }
};

// ------------------------ COOKIE OPTIONS ------------------------
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,      // REQUIRED for HTTPS
  sameSite: "none",  // REQUIRED for cross-domain cookies (Render + Vercel)
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ------------------------ DEMO LOGIN ------------------------
const demoLogin = asyncHandler(async (req, res) => {
  const demoEmail = "demo@gmail.com";

  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    user = await User.create({
      fullName: "Demo User",
      email: demoEmail,
      password: "Demo@123",
      phoneNumber: "9999999999",
      phoneVerified: true,
      subscription: "vip",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  const demoUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user: demoUser }, "Demo login successful"));
});

// ------------------------ REGISTER ------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  if (!fullName || !email || !phoneNumber || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existedUser) throw new ApiError(400, "User already exists");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await sendWhatsappOtp(phoneNumber, otp);

  const user = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    phoneOTP: otp,
    otpExpiry,
    phoneVerified: false,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

// ------------------------ VERIFY PHONE ------------------------
const verifyPhone = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) throw new ApiError(400, "User ID and OTP required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.phoneOTP !== otp) throw new ApiError(400, "Invalid OTP");
  if (user.otpExpiry < new Date()) throw new ApiError(400, "OTP expired");

  user.phoneVerified = true;
  user.phoneOTP = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Phone verified successfully"));
});

// ------------------------ LOGIN ------------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, phoneNumber } = req.body;

  if (!(email || phoneNumber)) throw new ApiError(400, "Email or phone required");

  const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (!user) throw new ApiError(404, "User not found");

  if (!user.phoneVerified) throw new ApiError(400, "Phone not verified");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Incorrect password");

  const { accessToken, refreshToken } =
    await generateAccessAndRefereshTokens(user._id);

  const loginUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user: loginUser }));
});

// ------------------------ LOGOUT ------------------------
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
  });

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "Logged out"));
});

// ------------------------ CURRENT USER ------------------------
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, { user }, "User fetched"));
});

// ------------------------ REFRESH TOKEN ------------------------
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingToken) throw new ApiError(401, "Unauthorized request");

  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decodedToken._id);
  if (!user) throw new ApiError(401, "User not found");

  if (incomingToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token expired or invalid");
  }

  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Access token refreshed"
      )
    );
});

// ------------------------ EXPORT ------------------------
export {
  loginUser,
  registerUser,
  logout,
  refreshAccessToken,
  verifyPhone,
  getCurrentUser,
  demoLogin,
};
