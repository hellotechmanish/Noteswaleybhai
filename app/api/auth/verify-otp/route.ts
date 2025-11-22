import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import OTPVerification from "@/lib/models/OTPVerification";
import { signToken } from "@/lib/jwt";
import { connectionToDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP required" },
        { status: 400 }
      );
    }

    await connectionToDb();

    // Find valid OTP
    const otpRecord = await OTPVerification.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Get user data verify
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isverify: true } },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete used OTP
    await OTPVerification.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = await signToken({
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isverify: user.isverify,
    });

    const response = NextResponse.json(
      {
        message: "Email verified successfully",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
