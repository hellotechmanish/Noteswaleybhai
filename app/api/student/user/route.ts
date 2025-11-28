import { getTokenPayload } from "@/lib/getTokenPayload";
import { connectionToDb } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
async function GET(request: Request) {
  try {
    const user = await getTokenPayload();

    if (!user?.userId) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectionToDb();
    const userData = await User.findById(user.userId).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!userData) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      user: userData,
      message: "User data fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getTokenPayload();

    if (!user?.userId) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    await connectionToDb();
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        university: body.university,
      },
      { new: true, runValidators: true }
    ).select("-password -__v -createdAt -updatedAt");

    if (!updatedUser) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
