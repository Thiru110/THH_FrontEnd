import { Box } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckToken } from "../axios/api";
import { authenticate, logout } from "../Redux/AuthSlice/authSlice";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  0% {
    transform: translateY(30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const GreetingMessage = styled.div`
  font-size: 42px;
  font-weight: 600;
  position: relative;
  height: 80px; /* Adjust as needed to fit all messages */
  bottom: 50px;
`;

const AnimatedSpan = styled.span`
  display: block;
  opacity: 0;
  animation: ${slideUp} 1s forwards;
  position: relative;
  bottom: 70px;
  font-size: ${(props) =>
    props.index !== 0 ? "32px" : "42px"}; /* Set font size for non-index 0 */
  top: ${(props) => props.top}px; /* Adjust this value to align the spans */
  color: ${(props) => props.color || "#68eb44"}; /* Default color */
`;
// animation-delay: ${props => props.delay}s;
const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth.isAuthenticated);
  const [visibleWords, setVisibleWords] = useState([]);

  const words = useMemo(
    () => [
      "Welcome to Talent Harbour Hub!",
      "Hello Recruiters !!!",
      // "A Product of Pozent.",
      "Streamlining Recruitment for Seamless Hiring.",
      "Chatbot is ready to assist you.",
    ],
    []
  );

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      navigate("/login");
      return;
    }

    CheckToken()
      .then((res) => {
        if (res.status === "Success") {
          dispatch(authenticate({ user: res.data }));
        } else {
          dispatch(logout());
          navigate("/login");
        }
      })
      .catch((err) => {
        dispatch(logout());
        navigate("/login");
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisibleWords((prevWords) => {
        if (prevWords.length < words.length) {
          return [...prevWords, words[prevWords.length]];
        }
        return prevWords;
      });
    }, 500); // Change this interval as needed

    return () => clearInterval(intervalId);
  }, [words]);

  return auth ? (
    <>
      <Box
        sx={{
          display: "flex",
          alignContent: "center",
          justifyContent: "space-evenly",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "65%",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            paddingLeft: "100px",
            paddingBottom: "130px",
          }}
        >
          <GreetingMessage className="greeting-message">
            <br />
            {visibleWords.map((word, index) => (
              <AnimatedSpan
                key={index}
                delay={index * 3} // Adjust delay based on the index
                color={index === 0 ? "black" : "#68eb44"} // Set color for index 0
                index={index} // Pass index as a prop
                // style={{
                //   paddingTop: "10px",
                // }}
              >
                {word}
              </AnimatedSpan>
            ))}
          </GreetingMessage>
        </Box>
        <Box sx={{ width: "35%" }}>
          {/* HomePage - */}
          <b>{/* {user.email} Username: {user.username} Role:{user.role} */}</b>
        </Box>
      </Box>
    </>
  ) : (
    <Box></Box>
  );
};

export default HomePage;
