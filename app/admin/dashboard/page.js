"use client";
import { db } from "@/firebase_config";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import KeyIcon from "@mui/icons-material/Key";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/navigation";

import { v4 as uuidv4 } from "uuid";

export default function DashboardPage() {
  const [nickname, setNickname] = useState("");
  const [accesscode, setAccesscode] = useState("");
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const validatePage = () => {
      const username = localStorage.getItem("admin_username");
      if (username !== "Berryblast") {
        router.push("/admin");
      }
    };

    const getData = async () => {
      const accessCollectionRef = collection(db, "accesscodes");
      const data = await getDocs(accessCollectionRef);
      const results = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCodes(results);
      setLoading(false);
    };

    validatePage();
    getData();
  });

  const submitForm = async () => {
    if (!nickname.trim() || !accesscode.trim()) {
      alert("Please fill in both fields");
      return null;
    }

    const accessCollectionRef = collection(db, "accesscodes");
    const response = await addDoc(accessCollectionRef, {
      nickname,
      accesscode,
      status: "active",
    });

    console.log(response);
  };

  const deleteCode = async (id) => {
    const accessDoc = doc(db, "accesscodes", id);
    await deleteDoc(accessDoc);
  };

  const generatePassword = async () => {
    const freecode = uuidv4();
    setAccesscode(freecode);
  };

  return (
    <div className="w-full md:w-[800px] mx-auto">
      <div className="mb-10 text-xl">
        <span>
          <AdminPanelSettingsIcon className="text-4xl" /> ADMIN PANEL
        </span>
      </div>

      {/* Generate access code */}
      <div className="border p-5 rounded-lg mb-5">
        <div className="badge badge-primary badge-outline mb-3">
          generate access code
        </div>
        <div className="mb-3">
          <div>
            <input
              type="text"
              className="login_input form-control mb-3 w-full"
              placeholder="Nick name"
              onChange={(event) => setNickname(event.target.value)}
            />
          </div>

          <div className="flex">
            <input
              type="text"
              className="login_input for-control w-full mb-5"
              placeholder="Access code"
              value={accesscode}
              onChange={(event) => setAccesscode(event.target.value)}
            />
            <AutorenewIcon
              className="text-green-400 text-4xl"
              onClick={generatePassword}
            />
          </div>

          <button type="button" className="login_button" onClick={submitForm}>
            Submit
          </button>
        </div>
      </div>

      {/* Access code list */}
      {loading ? (
        <LinearProgress />
      ) : (
        <div className="mt-10">
          <div className="badge badge-primary badge-outline mb-1 m-2">
            active access codes
          </div>

          {codes?.map((code) => (
            <div
              key={code.id}
              className="border shadow-lg py-2 px-5 rounded-lg mb-5"
            >
              <p>{code.nickname}</p>

              <div className="flex mb-2">
                <KeyIcon className="text-green-500 mr-4" />
                <span className="flex-1">{code.accesscode}</span>

                <DeleteForeverIcon
                  className="text-red-700 justify-end hover:cursor-pointer"
                  onClick={() => deleteCode(code.id)}
                />
              </div>

              <span className=" bg-slate-100 p-1 px-2 rounded-lg text-sm">
                <ContentCopyIcon className="text-sm" /> Copy to clipboard
              </span>

              {/* <CopyToClipboard text={"fish"}>copy to clipboard</CopyToClipboard> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
