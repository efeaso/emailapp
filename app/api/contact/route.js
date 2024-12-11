import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

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

    throw new Error("Failed to Send Email");

    let transportConfig;

    if (emailService === "zoho") {
      transportConfig = {
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: sender_email,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };
    } else {
      transportConfig = {
        service: emailService,
        auth: {
          user: sender_email,
          pass: password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };
    }

    var transporter = nodemailer.createTransport(transportConfig);

    const names = recipient_name.split(" ");
    let displayName = name + " " + sender_email;

    if (sender_name) {
      displayName = sender_name + " " + sender_email;
    }

    const mailOption = {
      //      from: `"${displayName}" <${sender_email}>`,
      from: `"${displayName}"`,
      to: recipient_email,
      subject: subject,
      headers: {
        "List-Unsubscribe": `<mailto:${sender_email}?subject=unsubscribe>`,
        Precedence: "bulk",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
      html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.4; color: #333;">
    <p>Hello ${names[0]},</p>
    <p>${message}</p>
    <div style="margin-top: 10px;">
      ${greeting},<br/>
      ${name}
    </div>
    
  </body>
  </html>
`,
      textEncoding: "base64",
      priority: "normal",
    };

    // Add DKIM if available
    if (process.env.DKIM_PRIVATE_KEY) {
      transporter.use(
        "compile",
        require("nodemailer-dkim").signer({
          domainName: sender_email.split("@")[1],
          keySelector: "default",
          privateKey: process.env.DKIM_PRIVATE_KEY,
        })
      );
    }

    await transporter.sendMail(mailOption);

    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { message: "Failed to Send Email" },
      { status: 500 }
    );
  }
}
