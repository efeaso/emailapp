import { sendEmail } from "@/lib/emailService";
import { NextResponse } from "next/server";
// Make sure path matches your file structure

export async function POST(request) {
  try {
    const {
      recipient_email,
      subject,
      message,
      sender_email,
      emailService,
      password,
      name,
      recipient_name,
      greeting,
      sender_name,
    } = await request.json();

    await sendEmail({
      recipient_email,
      subject,
      message,
      sender_email,
      emailService,
      password,
      name,
      recipient_name,
      greeting,
      sender_name,
    });

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error);

    // More specific error responses
    if (error.code === "EAUTH") {
      return NextResponse.json(
        { message: "Authentication failed. Please check your credentials." },
        { status: 401 }
      );
    }

    if (error.code === "ESOCKET") {
      return NextResponse.json(
        { message: "Connection failed. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Failed to Send Email" },
      { status: 500 }
    );
  }
}
