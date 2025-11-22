import { NextRequest, NextResponse } from "next/server";
import { connectionToDb } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log("credetial : ", email, password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectionToDb();

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("user>>>>>", user);

    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // Compare password using schema method
    const isPasswordValid = await user.comparePassword(password);
    console.log("isPasswordValid", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid  password" }, { status: 401 });
    }

    const token = await signToken({
      userId: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isverify: user.isverify,
    });

    console.log("token", token);

    const response = NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isverify: user.isverify,
        },
      },
      { status: 200 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
