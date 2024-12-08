"use client";
import React from "react";
import EmailService from "@/components/email";

import Button from "@mui/material/Button";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

export default function Dashboard() {
  function newTab() {
    window.open("/bulkemail", "_blank");
  }

  return (
    <div className="min-h-screen mx-auto w-full md:w-[600px]">
      <EmailService />
      <br />
      <Button
        onClick={newTab}
        variant="outlined"
        startIcon={<ControlPointIcon />}
      >
        Create a new tab
      </Button>
    </div>
  );
}
