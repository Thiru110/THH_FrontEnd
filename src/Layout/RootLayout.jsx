import React, { useState } from "react";
import Navbar from "../Components/navbar";
import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import bot from "../Utils/bot.gif";
import Chatbox from "../Components/Chatbot/chatbot";

const RootLayout = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const handleBotClick = () => {
    setIsChatboxOpen((prevState) => !prevState);
  };
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}

      <Navbar />

      {/* CONTENT */}
      <Container
        // !Content
        sx={{
          flex: 1,
          ml: "0px",
          mr: "0px",
          position: "relative",
          marginTop: "64px",
          backgroundImage: `linear-gradient(135deg, rgba(244, 244, 244,0.07) 0%, rgba(244, 244, 244,0.07) 12.5%,rgba(211, 211, 211,0.07) 12.5%, rgba(211, 211, 211,0.07) 25%,rgba(178, 178, 178,0.07) 25%, rgba(178, 178, 178,0.07) 37.5%,rgba(145, 145, 145,0.07) 37.5%, rgba(145, 145, 145,0.07) 50%,rgba(113, 113, 113,0.07) 50%, rgba(113, 113, 113,0.07) 62.5%,rgba(80, 80, 80,0.07) 62.5%, rgba(80, 80, 80,0.07) 75%,rgba(47, 47, 47,0.07) 75%, rgba(47, 47, 47,0.07) 87.5%,rgba(14, 14, 14,0.07) 87.5%, rgba(14, 14, 14,0.07) 100%),linear-gradient(45deg, rgba(236, 236, 236,0.07) 0%, rgba(236, 236, 236,0.07) 12.5%,rgba(210, 210, 210,0.07) 12.5%, rgba(210, 210, 210,0.07) 25%,rgba(183, 183, 183,0.07) 25%, rgba(183, 183, 183,0.07) 37.5%,rgba(157, 157, 157,0.07) 37.5%, rgba(157, 157, 157,0.07) 50%,rgba(130, 130, 130,0.07) 50%, rgba(130, 130, 130,0.07) 62.5%,rgba(104, 104, 104,0.07) 62.5%, rgba(104, 104, 104,0.07) 75%,rgba(77, 77, 77,0.07) 75%, rgba(77, 77, 77,0.07) 87.5%,rgba(51, 51, 51,0.07) 87.5%, rgba(51, 51, 51,0.07) 100%),linear-gradient(90deg, #ffffff,#ffffff)`,
        }}
        maxWidth={false}
        s
        disableGutters
      >
        <Outlet />
        {/* Bot */}
        <Box
          sx={{
            position: "fixed",
            bottom: "12%",
            right: "5%",
            width: "100px",
            height: "130px",
            overflow: "hidden",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={handleBotClick}
        >
          <img
            src={bot}
            alt="bot"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <p
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              margin: 0,
              fontSize: "10px",
              fontWeight: "700",
            }}
          >
            ZENBOT
          </p>
        </Box>
        {isChatboxOpen && <Chatbox />}
        {/* Bot end */}
      </Container>
      {/* FOOTER */}
      <Box
        component={"footer"}
        sx={{
          height: "5%",
          backgroundColor: "#3778a6",
          color: "white",
          display: "flex",
          alignItems: "center",
          paddingLeft: "40px",
        }}
      >
        ©2024 Pozent. All Rights Reserved.
      </Box>
    </Box>
  );
};

export default RootLayout;
