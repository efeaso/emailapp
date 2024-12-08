import React from "react";
import Alert from "@mui/material/Alert";
export default function ResultTwo({ emails }) {
  if (emails.length == 0) {
    return (
      <Alert severity="success">All Messages were successfully sent</Alert>
    );
  }

  //  console.log(emails);
  return (
    <>
      <Alert severity="error" variant="filled">
        Error in sending {emails.length} Messages.
      </Alert>
    </>
  );
}
