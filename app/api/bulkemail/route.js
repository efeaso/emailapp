import {
  testAPi,
  updateCode,
  uploadCode,
  validateCode,
} from "@/lib/validateAccess";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

async function sendMail(
  recipient_email,
  subject,
  message,
  sender_email,
  emailService,
  password,
  name,
  recipient_name,
  greeting
) {
  try {
    var transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: sender_email,
        pass: password,
      },
    });

    const names = recipient_name.split(" ");
    const mailOption = {
      from: `"${name}" ${sender_email}`,
      to: recipient_email,
      subject: subject,
      html: `
       <!DOCTYPE html>
<html lang="en">
<body>
<p>Hello ${names[0]}</p>
<p>${message}</p>
<br />
<div>${greeting},
<br />
${name}</div>
</body>
</html>
        `,
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    return false;
  }

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function POST(request) {
  const {
    code,
    checked,
    subject,
    message,
    emailService,
    sender_email,
    password,
    contactsList,
    greeting,
  } = await request.json();

  const route_id = uuidv4();

  var delay = 16000; // 16 second

  const result = await uploadCode(
    code,
    checked,
    subject,
    message,
    emailService,
    sender_email,
    password,
    contactsList,
    greeting,
    route_id
  );
  console.log(result);

  let successfulEmail = [];
  let unsuccessfulEmail = [];
  for (var i = 0; i < contactsList.length; i++) {
    const response = await sendMail(
      contactsList[i].email,
      checked ? contactsList[i].receiver_name : subject,
      message,
      sender_email,
      emailService,
      password,
      contactsList[i].sender_name,
      contactsList[i].receiver_name,
      greeting
    );

    console.log(response);

    if (!response) {
      unsuccessfulEmail.push(contactsList[i]);
    } else {
      successfulEmail.push(contactsList[i]);
    }

    // Wait for the specified delay before processing the next item
    await sleep(delay);
  }

  const result2 = await updateCode(
    successfulEmail,
    unsuccessfulEmail,
    route_id
  );

  return NextResponse.json(
    { message: "Email Sent Successfully" },
    { status: 200 }
  );
}
