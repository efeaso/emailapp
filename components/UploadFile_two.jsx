import React, { useState } from "react";
import { isEmail } from "@/lib/validation";

export default function UploadFileTwo({
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

    for (let i = 0; i < fileContent.length; i++) {
      if (isNaN(fileContent[i])) {
        alert("Error on line " + [i + 1] + ":" + fileContent[i]);
        return;
      }

      contactsList.push(fileContent[i]);
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
