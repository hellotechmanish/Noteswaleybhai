"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function OtpForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the OTP sent to <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Email verified! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <Input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength={6}
              disabled={loading}
              className="text-center text-2xl tracking-widest"
            />
          </div>

          <div className="text-center text-sm">
            <p
              className={
                timeLeft < 60
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }
            >
              Time remaining: {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || timeLeft <= 0}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the OTP?{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
            >
              Resend
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
