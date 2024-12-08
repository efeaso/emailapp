"use client";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { horizontal, vertical } from "@/lib/Alert";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { useRouter } from "next/navigation";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getData = () => {
      if (
        localStorage.getItem("admin_username") &&
        localStorage.getItem("admin_password")
      ) {
        setPassword(localStorage.getItem("admin_password"));
        setUsername(localStorage.getItem("admin_username"));
      }
    };

    //  getData();
  });

  // Notification handler
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Form Submition
  const submitForm = async () => {
    if (!password && !username) {
      setError("Please type in the credentials");
      handleClick();
      return;
    }

    if (
      username.trim() == "Berryblast" &&
      password.trim() == "Lookupcheckmate1"
    ) {
      localStorage.setItem("admin_username", username);
      localStorage.setItem("admin_password", password);
      router.push("/admin/dashboard");
    } else {
      setError("Credentials Invalid");
      handleClick();
      return;
    }
  };

  return (
    <div className="m-3">
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
      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img
                src="/images/draw2.webp"
                className="w-full"
                alt="Sample image"
              />
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              <form>
                <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                  <p className="text-center font-semibold mx-4 mb-0">
                    ADMIN PANEL
                  </p>
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    className="login_input form-control"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="text"
                    className="login_input form-control"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                  />
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="button"
                    className="login_button"
                    onClick={submitForm}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
