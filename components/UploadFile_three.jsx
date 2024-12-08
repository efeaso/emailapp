import React, { useState } from "react";
import { isEmail } from "@/lib/validation";
export default function UploadFileThree({
  setContactsList,
  handleClick,
  setError,
}) {
  const [fileData, setFileData] = useState();
  const readFileData = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    var fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "txt") {
      setError("Please upload only .txt files");
      handleClick();
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      scanFile(reader.result.trim());
    };
    reader.onerror = () => {
      console.log("file error", reader.error);
    };
  };
  const scanFile = (file) => {
    const fileContentTrimmed = file.split(/\r?\n/);
    let fileContent = [];
    for (let i = 0; i < fileContentTrimmed.length; i++) {
      let test = fileContentTrimmed[i].trim();
      if (test) {
        fileContent.push(fileContentTrimmed[i]);
      }
    }

    let contactsList = [];

    for (let i = 0; i < fileContent.length; i += 2) {
      if (i + 1 > fileContent.length) {
        return;
      }
      let second_line = fileContent[i + 1].split(" ");

      let receiverName = [];
      let receiverEmail;
      for (let j = 0; j < second_line.length; j++) {
        if (isEmail(second_line[j])) {
          receiverEmail = second_line[j];
        } else {
          receiverName.push(second_line[j]);
        }
      }

      if (!receiverEmail) {
        alert("Error on line " + [i + 1] + ": " + second_line);
        return;
      }

      contactsList.push({
        sender_name: fileContent[i],
        receiver_name: receiverName.join(" "),
        email: receiverEmail,
      });
    }

    setContactsList(contactsList);
  };
  return (
    <div>
      <div className="badge badge-info text-white mb-2">
        File must be a .txt file
      </div>
      <div className="text-left flex">
        <input
          type="file"
          className="file-input file-input-bordered file-input-info w-full"
          onChange={readFileData}
        />
      </div>
    </div>
  );
}
