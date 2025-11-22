import { NextRequest, NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import User from "@/lib/models/User";
import OTPVerification from "@/lib/models/OTPVerification";
import { sendOTPEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectionToDb();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create user (password will be hashed by schema middleware)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: "student",
    });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTPVerification.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json(
      {
        message: "Signup successful. OTP sent to email.",
        userId: user._id,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
