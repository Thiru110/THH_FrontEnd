import { Button, Divider, styled } from "@mui/material";
import React from "react";
import img from "../Utils/image.png";
// import img from "../Utils/bbb3.jpg";
import pozentImg from "../Utils/pozent.png";

// Correctly define the styled component
const StyledBox = styled("div")({
  backgroundColor: "white",
  height: "50%",
});

const SplitedDiv = styled("div")({
  flex: "1",
  backgroundColor: "#183266",
  margin: "1px 4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const LandingPage = () => {
  return (
    <>
      {/* MAIN */}
      <div style={{ maxWidth: "100vw", height: "100vh" }}>
        <div
          className="mainPage"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
          }}
        >
          {/* HEADER */}
          <header
            className="mainpage-navbar"
            style={{
              color: "white",
              // backgroundColor: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "25px 25px",
            }}
          >
            {/* IMAGE */}
            <div>
              {/* <div>{pozentImg}</div> */}
              <img
                src={pozentImg}
                alt="Pozent"
                style={{ width: "100px", height: "auto" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button variant="text" href="/login">
                Get Start
              </Button>
              <Button
                sx={{ color: "white", marginLeft: 2 }}
                variant="contained"
                href="https://pozent.com/contact-us/"
              >
                Contact Us
              </Button>
            </div>
          </header>
          <div style={{ color: "white" }}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde velit
            sapiente at illum nobis, perspiciatis quis optio, molestias omnis
            laborum aperiam quaerat labore similique eligendi. Ipsam illo magni
            in reprehenderit.
          </div>
        </div>
        {/* CONTENT */}
        <StyledBox sx={{ height: "50%" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
          mollitia officiis animi quia cum fugit, cumque, laborum nisi ipsum
          iste corrupti non dolore consequatur possimus delectus facere iure
          dolores voluptatem.
        </StyledBox>
        <Divider sx={{ bgcolor: "green" }} />
        <StyledBox sx={{ height: "50%" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
          mollitia officiis animi quia cum fugit, cumque, laborum nisi ipsum
          iste corrupti non dolore consequatur possimus delectus facere iure
          dolores voluptatem.
        </StyledBox>
        <Divider sx={{ bgcolor: "green" }} />
        <StyledBox sx={{ height: "50%" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
          mollitia officiis animi quia cum fugit, cumque, laborum nisi ipsum
          iste corrupti non dolore consequatur possimus delectus facere iure
          dolores voluptatem.
        </StyledBox>
        <Divider sx={{ bgcolor: "green" }} />
        {/* FOOTER */}
        <footer
          style={{ height: "50%", backgroundColor: "#294261", color: "white" }}
        >
          <div
            className="top-footer"
            style={{ padding: "30px", height: "75%" }}
          >
            <div
              className="container"
              style={{
                display: "flex",
                height: "100%",
                maxWidth: "100%",
                flexDirection: "row",
              }}
            >
              <SplitedDiv>1</SplitedDiv>
              <SplitedDiv>2</SplitedDiv>
              <SplitedDiv>3</SplitedDiv>
              <SplitedDiv>4</SplitedDiv>
            </div>
          </div>
          <Divider sx={{ bgcolor: "green" }} />
          <div style={{ textAlign: "center", paddingTop: "25px" }}>
            <div className="bottom-footer">
              ©2024 Pozent. All Rights Reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
