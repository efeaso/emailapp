import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i.test(email);

export const isPassword = (password) => {
  if (password.length < 7 || password.length > 15) {
    return false;
  } else {
    return true;
  }
};

export const formatLists = async (entry) => {
  const transactionRef = collection(db, "emails");

  try {
    await addDoc(transactionRef, entry);
  } catch (error) {
    console.log("addTrend error :", error);
    return false;
  }

  return true;
};
