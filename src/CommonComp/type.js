import React, { useState, useEffect } from "react";

export const Type = ({ text }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let typedText = "";
    let timeoutId;

    const typeText = () => {
      if (currentIndex < text.length) {
        typedText += text[currentIndex];
        setDisplayText(typedText);
        currentIndex++;
        timeoutId = setTimeout(typeText, 10); // Call typeText again after the specified speed
      } else {
        // Pause after the text is fully typed out before resetting
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          typedText = "";
          setDisplayText(""); // Clear displayText
        }, 1000); // Adjusted pause duration before starting the next typing effect
      }
    };

    typeText(); // Start typing immediately

    return () => clearTimeout(timeoutId); // Clean up the timeout when the component unmounts
  }, [text]);

  return (
    <>
      <h1 style={{ fontSize: "40px" }}>{displayText}</h1>
      {/* Reduced font size */}
    </>
  );
};
