import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";
import crypto from "crypto";

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

    const { orderId, paymentId, signature } = await request.json();

    // Verify signature
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await dbConnect();
    const payment = await Payment.findOne({ razorpayOrderId: orderId });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const expiresAt =
      payment.type === "view"
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : null;

    payment.razorpayPaymentId = paymentId;
    payment.status = "completed";
    payment.accessExpires = expiresAt;
    payment.updatedAt = new Date();
    await payment.save();

    return NextResponse.json({
      message: "Payment verified successfully",
      paymentId,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
