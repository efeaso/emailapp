import React, { useState } from "react";
import { isEmail } from "@/lib/validation";

export default function UploadFile({ setContactsList, handleClick, setError }) {
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
    const fileContent = file.split(/\r?\n/);
    let contactsList = [];
    for (let i = 0; i < fileContent.length; i += 4) {
      // validate Email
      if (!isEmail(fileContent[i + 2])) {
        const lineNo = i + 2;
        setError(
          "Error in your file arrangement on Line" +
            " " +
            lineNo +
            " " +
            fileContent[i + 2]
        );
        handleClick();
        return;
      }

      contactsList.push({
        sender_name: fileContent[i],
        receiver_name: fileContent[i + 1],
        email: fileContent[i + 2],
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
