export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: "student" | "admin";
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Course {
  id: string;
  universityId: string;
  name: string;
}

export interface Subject {
  id: string;
  courseId: string;
  name: string;
  semester: number;
}

export interface Note {
  id: string;
  userId: string;
  subjectId: string;
  title: string;
  description?: string;
  pdfPath: string;
  fileSize?: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  earnings: number;
  approvedAt?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  noteId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  type: "view" | "download";
  amount: number;
  status: "pending" | "completed" | "failed";
  accessExpires?: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "student" | "admin";
  isverify: boolean;
  iat: number;
  exp: number;
}
