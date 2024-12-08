import React, { useState } from "react";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import KeyIcon from "@mui/icons-material/Key";
import Checkbox from "@mui/material/Checkbox";
import UploadFile from "../UploadFile";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { horizontal, vertical } from "@/lib/Alert";
import VerifiedIcon from "@mui/icons-material/Verified";
import { isEmail } from "@/lib/validation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import RefreshIcon from "@mui/icons-material/Refresh";

import Feedback from "./feedback";
import Result from "./result";
import UploadFileTwo from "../UploadFile_two";
import { signOut, useSession } from "next-auth/react";
import ResultTwo from "./result_two";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FormTwo() {
  // MUI states
  const [checked, setChecked] = React.useState(false);

  // Error State
  const [error, setError] = useState(false);

  // Loading State && Success State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Counter State
  const [counter, setCounter] = useState(0);

  // Contact List State
  const [contactsList, setContactsList] = useState([]);

  // Form States
  const [message, setMessage] = useState("");

  // Successful & Unsuccessful State
  const [queriedEMail, setQueriedEmail] = useState({
    successfulEmails: [],
    unsuccessfulEmails: [],
  });

  // Notification handler
  const [open, setOpen] = React.useState(false);

  // Error Function
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = async () => {
    // Clear log
    setSuccess(false);

    // Validate Data
    if (!message) {
      setError("Please Enter all Fields");
      handleClick();
      return;
    }

    if (contactsList.length == 0) {
      setError("Please Upload Contacts File");
      handleClick();
      return;
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    setLoading(true);

   

    if (!result) {
      alert("Your Access code is inValid");
      signOut();
      return;
    }

    async function delayedLoop() {
      var delay = 10000; // 10 second

      let successfulEmail = [];
      let unsuccessfulEmail = [];
      for (var i = 0; i < contactsList.length; i++) {
        // Perform some task with the current item
        console.log("Processing item:", contactsList[i]);
        setCounter(i + 1);

        const response = await fetch("/api/bulksms", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            message,
            phone: contactsList[i],
          }),
        });

        console.log(response);

        if (!response.ok) {
          unsuccessfulEmail.push(contactsList[i]);
        } else {
          successfulEmail.push(contactsList[i]);
        }

        // Wait for the specified delay before processing the next item
        await sleep(delay);
      }
      setSuccess(true);
      setLoading(false);
      setQueriedEmail({
        successfulEmails: successfulEmail,
        unsuccessfulEmails: unsuccessfulEmail,
      });
    }

    delayedLoop();
  };

  return (
    <div className="space-y-7">
      <Snackbar
        open={open}
        onClose={handleClose}
        message="I love snacks"
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", top: 0 }}
        >
          {error}
        </Alert>
      </Snackbar>

      <textarea
        id="message"
        rows="6"
        onChange={(e) => setMessage(e.target.value)}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Leave a message"
      ></textarea>

      <UploadFileTwo
        setContactsList={setContactsList}
        setError={setError}
        handleClick={handleClick}
      />

      {contactsList.length > 0 && (
        <div className="badge p-2">
          <VerifiedIcon className="text-green-400 text-sm" />
          {contactsList.length} Contacts Retrieved
        </div>
      )}

      {loading && <Feedback contactsList={contactsList} counter={counter} />}

      {success && <ResultTwo emails={queriedEMail.unsuccessfulEmails} />}

      <div>
        <button
          className="py-3 px-5 m-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
          onClick={handleSubmit}
        >
          Send message
        </button>

        <button
          className="px-5 bg-gray-200 py-3"
          onClick={() => {
            // setEmail("");
            // setPassword("");

            location.reload();
          }}
        >
          <RefreshIcon className="text-red-500 mr-2" />
          Clear Fields
        </button>

        <button
          onClick={() => signOut()}
          className="py-3 px-5 m-5 text-sm font-medium text-center text-white rounded-lg bg-red-700 sm:w-fit hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
