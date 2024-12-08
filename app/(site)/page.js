"use client";
import React, { useEffect, useState } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <div className="m-3">
      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0 text-center">
              <img
                src="/images/draw2.webp"
                className="w-full"
                alt="Sample image"
              />
              <span
                className="border p-2 rounded-lg flex-1 m-5 hover:cursor-pointer"
                onClick={() => router.push("/admin/dashboard")}
              >
                <AdminPanelSettingsIcon className="text-red-400" />
                Support
              </span>
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0 text-center flex">
              <a
                className="border p-2 rounded-lg flex-1 m-5 hover:cursor-pointer"
                href="/bulkemail"
              >
                <SentimentSatisfiedAltIcon className="text-blue-400" />
                LOGIN
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
