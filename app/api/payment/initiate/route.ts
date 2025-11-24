import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { noteId, type } = await request.json();

    if (!noteId || !type) {
      return NextResponse.json(
        { error: "Note ID and type required" },
        { status: 400 }
      );
    }

    const amount = type === "view" ? 500 : 2500; // in paise (₹5 or ₹25)

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `${noteId}-${type}-${Date.now()}`,
    });

    await dbConnect();
    await Payment.create({
      userId: payload.userId,
      noteId,
      razorpayOrderId: order.id,
      type,
      amount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
