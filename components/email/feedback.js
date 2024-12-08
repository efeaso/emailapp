import LinearWithValueLabel from "@/lib/linear-progress";
import React from "react";

export default function Feedback({ contactsList, counter }) {
  return (
    <>
      <div className="text-blue-800 border-t pt-10">
        Delivered to {counter} Contacts
        <LinearWithValueLabel
          progress={counter}
          totalNo={contactsList.length}
        />
      </div>
    </>
  );
}
