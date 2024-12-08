import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Feedback from "./feedback";

export default function Result({
  emails,
  checked,
  subject,
  emailAddress,
  emailService,
  message,
  passwordService,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [counter, setCounter] = useState(0);
  const [emailsList, setEmailsList] = useState([]);

  if (emails.length == 0) {
    return <Alert severity="success">All Emails were successfully sent</Alert>;
  }

  const retrySubmit = () => {
    setLoading(true);
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function delayedLoop() {
      var delay = 16000; // 16 seconds

      let fakeEmails = [];

      for (var i = 0; i < emails.length; i++) {
        console.log("Retrying emails", emails[i]);
        setCounter(i + 1);

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            subject: checked ? emails[i].receiver_name : subject,
            message,
            recipient_email: emails[i].email,
            emailService,
            sender_email: emailAddress,
            password: passwordService,
            name: emails[i].sender_name,
            recipient_name: emails[i].receiver_name,
          }),
        });

        if (!response.ok) {
          fakeEmails.push(emails[i]);
        }

        await sleep(delay);
      }

      setEmailsList(fakeEmails);
      setLoading(false);
      setSuccess(true);
    }

    delayedLoop();
  };

  return (
    <>
      {!success && (
        <Alert
          severity="warning"
          action={
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={retrySubmit}
            >
              RE-TRY
            </Button>
          }
        >
          Error in sending to {emails.length} emails
        </Alert>
      )}

      {loading && <Feedback counter={counter} contactsList={emails} />}

      {success && (
        <>
          {emailsList.length == 0 ? (
            <Alert security="success">Successfully Sent All Emails</Alert>
          ) : (
            <Alert severity="error" variant="filled">
              Error in sending Emails. Your App Password is incorrect
            </Alert>
          )}
        </>
      )}
    </>
  );
}
