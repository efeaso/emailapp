import nodemailer from "nodemailer";

class EmailTransportManager {
  constructor() {
    this.transporters = new Map();
    this.defaultPoolConfig = {
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5,
      timeout: 30000,
    };
  }

  getTransporterConfig(emailService, auth) {
    const baseConfig = {
      pool: true,
      ...this.defaultPoolConfig,
      auth,
    };

    switch (emailService) {
      case "zoho":
        return {
          ...baseConfig,
          host: "smtp.zoho.com",
          port: 465,
          secure: true,
        };
      case "gmail":
        return {
          ...baseConfig,
          service: "gmail",
        };
      case "mail.ru":
        return {
          ...baseConfig,
          service: "mail.ru",
        };
      case "FastMail":
        return {
          ...baseConfig,
          host: "smtp.fastmail.com",
          port: 465,
          secure: true,
        };
      default:
        throw new Error(`Unsupported email service: ${emailService}`);
    }
  }

  getTransporterId(emailService, senderEmail) {
    return `${emailService}-${senderEmail}`;
  }

  async getTransporter(emailService, senderEmail, password) {
    const transporterId = this.getTransporterId(emailService, senderEmail);

    if (this.transporters.has(transporterId)) {
      const transporter = this.transporters.get(transporterId);

      // Verify connection is still valid
      try {
        await transporter.verify();
        return transporter;
      } catch (error) {
        console.log(
          `Connection invalid for ${transporterId}, creating new one`
        );
        this.transporters.delete(transporterId);
      }
    }

    const config = this.getTransporterConfig(emailService, {
      user: senderEmail,
      pass: password,
    });

    const transporter = nodemailer.createTransport(config);

    // Verify connection before storing
    await transporter.verify();

    this.transporters.set(transporterId, transporter);
    return transporter;
  }

  async closeTransporter(emailService, senderEmail) {
    const transporterId = this.getTransporterId(emailService, senderEmail);
    const transporter = this.transporters.get(transporterId);

    if (transporter) {
      await transporter.close();
      this.transporters.delete(transporterId);
    }
  }

  async closeAllTransporters() {
    const closePromises = Array.from(this.transporters.values()).map(
      (transporter) => transporter.close()
    );
    await Promise.all(closePromises);
    this.transporters.clear();
  }
}

// Create singleton instance
const transportManager = new EmailTransportManager();

export async function sendEmail({
  recipient_email,
  subject,
  message,
  sender_email,
  emailService,
  password,
  name,
  recipient_name,
  intro,
  greeting,
  sender_name,
}) {
  try {
    const transporter = await transportManager.getTransporter(
      emailService,
      sender_email,
      password
    );

    const names = recipient_name.split(" ");
    const displayName = sender_name
      ? `${sender_name} ${sender_email}`
      : `${name} ${sender_email}`;

    const mailOptions = {
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
          <p>${intro} ${names[0]},</p>
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

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email error:", error);
    // Close the problematic connection on error
    await transportManager.closeTransporter(emailService, sender_email);
    throw error;
  }
}
