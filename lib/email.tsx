import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendOTPEmail(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Student Notes Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Email Verification</h2>
          <p style="font-size: 16px;">Your OTP is:</p>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="font-size: 32px; font-weight: bold; color: #2563eb; margin: 0;">${otp}</p>
          </div>
          <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes.</p>
          <p style="font-size: 12px; color: #999;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Failed to send OTP email:', error)
    return false
  }
}
