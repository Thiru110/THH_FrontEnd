import React, { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import sendButton from "../../Utils/sendButton.png";
import { useSelector } from "react-redux";
import { handleFetchCP } from "../../axios/api";
import CancelIcon from "@mui/icons-material/Cancel";
// import bgAI from "../../Utils/bgAI.webp";
// import bgAI from "../../Utils/bgAI2.jpg";
import SearchIcon from "../../Utils/SearchIcon.gif";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosConfig";
import { Loader } from "../../CommonComp/LoaderComponent/loader";
import { TbMessageChatbot } from "react-icons/tb";
const Chatbox = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there 👋\nHow can I help you today?\nA. Fetch Resume\nB. Document Validation \nC. Link Extraction \n D. NLP",
      fromBot: true,
    },
  ]);
  const [isBotLoading, setBotLoading] = useState(false);
  const fileInputRef = useRef(null);

  // *    GETTING USER DETAILS
  const user = useSelector((state) => state.auth.user);
  const userEmail = user.email;
  // console.log(user.email);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileName, setSelectedFileName] = useState(""); // New state variable
  // ! for scroll automatically
  const messagesEndRef = useRef(null);

  // Load messages from local storage when again comes
  // ! for scroll automatically
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    const storedFile = localStorage.getItem("selectedFile");
    const storedFileName = localStorage.getItem("selectedFileName");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
      if (storedFile) {
        setSelectedFile(JSON.parse(storedFile));
      }
      if (storedFileName) {
        setSelectedFileName(storedFileName); // Set the stored file name
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to local storage whenever the messages state changes
    localStorage.setItem("chatMessages", JSON.stringify(messages));

    // Scroll to the bottom of the messages container when messages state changes
    if (selectedFile) {
      localStorage.setItem("selectedFile", JSON.stringify(selectedFile));
      localStorage.setItem("selectedFileName", selectedFileName);
    }
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedFile, selectedFileName]);

  // ?  for again recall the working tree
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.text ===
        "Your resumes have been fetched click dashboard to view your resumes"
    ) {
      handleSend();
    }
  }, [messages]);

  // ?-----------------  WORKING TREE INTEGRATION API CALL ------------------------
  const handleSend = () => {
    const userMessage = input.trim();
    if (userMessage !== "") {
      //* Add the user message to the chat
      setMessages([
        ...messages,
        {
          text: userMessage,
          fromBot: false,
        },
      ]);
      //* Clear the input field after sending the message
      setInput("");
      // generateResponse(messages)
      setBotLoading(true);
      axios
        .post(
          "http://localhost:4000/response",
          { message: userMessage },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const botMessage = response.data.message;
          // botResMessage = botMessage;
          // Add the bot's response to the chat
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: botMessage,
              fromBot: true,
            },
          ]);
        })
        .catch((error) => {
          console.error("Error processing response:", error);
        })
        .finally(() => setBotLoading(false));
    }
  };

  const handleSearch = async (input, userEmail) => {
    setBotLoading(true);
    await axiosInstance
      .post(
        "/search",
        { user_input: input, email: userEmail, file_name: "datascience" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // handle success
        setInput("");

        console.log(response.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: input,
            fromBot: false,
          },
          {
            text: response.data.message,
            fromBot: true,
          },
        ]);
      })
      .catch((error) => {
        // handle error
        console.error(error);
        toast.error(
          "Please use a more specific query (For eg., include the job role and the university/college you want the candidate from)"
        );
        setInput("");
      })
      .finally(() => setBotLoading(false));
  };

  // ! this one is correct
  // const handleSearch = (input, userEmail) => {
  //   axiosInstance
  //     .post("/search", { input, userEmail })
  //     .then((response) => {
  //       // handle success
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       // handle error
  //       console.error(error);
  //     });
  // };

  // const handleSearch = async (input, userEmail) => {
  //   try {
  //     const response = await axiosInstance.post("/search", {
  //       input,
  //       userEmail,
  //     });

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         text: input,
  //         fromBot: false,
  //       },
  //     ]);

  //     console.log("Search completed successfully", response.data);
  //     // toast.success("Search completed successfully")
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         text: response.data.message, // Assuming response contains a message field
  //         fromBot: true,
  //       },
  //     ]);

  //     toast.success("Successfully fetched");
  //   } catch (error) {
  //     console.error("Error during search:", error);

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         text: "An error occurred while processing your request.",
  //         fromBot: true,
  //       },
  //     ]);

  //     toast.error("Error occurred while fetching");
  //   }
  // };

  const handleFile = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };
  //! api file contains fetchResume-->upload and copypaste(madhi)
  const handleButtonClick = () => {
    // Trigger the hidden file input when the button is clicked
    fileInputRef.current.click();
  };
  // const handleFetch = (selectedFile, userEmail) => {
  //   if (selectedFile && userEmail) {
  //     // Add user action (file upload) to the chat
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         text: `Uploading file: ${selectedFile.name}`,
  //         fromBot: false,
  //       },
  //     ]);

  //     // Clear file input after sending the message
  //     clearFileSelection();

  //     const formData = new FormData();
  //     formData.append("file", selectedFile);
  //     formData.append("email", userEmail);

  //     axiosInstance
  //       .post("/extract_keywords", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         toast.success(
  //           "Your resumes have been fetched. Click dashboard to view your resumes."
  //         );
  //         // Add success message to the chat
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             text: "File uploaded successfully.",
  //             fromBot: false,
  //           },
  //         ]);
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading file:", error);
  //         // Add error message to the chat
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             text: "File upload failed. Please try again.",
  //             fromBot: false,
  //           },
  //         ]);
  //       });
  //   }
  // };
  // !this is having email and file need to fix the email
  // const handleImageUpload = async (selectedFile, userEmail) => {
  //   if (selectedFile && userEmail) {
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);
  //     formData.append("email", userEmail);
  //     setBotLoading(true);
  //     await axios
  //       .post("/validate_image", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             text: "Image uploaded successfully. Please wait while we process your request.",
  //             fromBot: true,
  //           },
  //         ]);
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading image:", error);
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             text: "Image upload failed. Please try again.",
  //             fromBot: true,
  //           },
  //         ]);
  //         clearFileSelection();
  //       })
  //       .finally(() => setBotLoading(false));
  //   }
  // };
  const handleImageUpload = async (selectedFile) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      setBotLoading(true);
      await axiosInstance
        .post("/docvalidation", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              // text: "Image uploaded successfully. Please wait while we process your request.",
              text: response?.data,
              fromBot: true,
            },
          ]);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Image upload failed. Please try again.",
              fromBot: true,
            },
          ]);
          clearFileSelection();
        })
        .finally(() => setBotLoading(false));
    }
  };

  const handleFetch = (selectedFile, userEmail) => {
    if (selectedFile && userEmail) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("email", userEmail);
      setBotLoading(true);
      axiosInstance
        .post("/extract_keywords", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success(
            "Your resumes have been fetched click dashboard to view your resumes"
          );
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "File uploaded successfully.you can see in dashboard",
              fromBot: false,
            },
          ]);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Fetching resumes failed sorry for the inconvenience. Please try again.",
              fromBot: false,
            },
          ]);
          clearFileSelection();
        })
        .finally(() => setBotLoading(false));
    }
  };

  // !correct code
  // const handleFetch = (selectedFile, userEmail) => {
  //   if (selectedFile && userEmail) {
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);
  //     formData.append("email", userEmail); // Append the user email

  //     axios
  //       .post("http://localhost:4000/extract_keywords", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         toast.success(
  //           "Your resumes have been fetched click dashboard to view your resumes"
  //         );
  //         console.log("File uploaded successfully", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error uploading file:", error);
  //       });
  //   }
  // };
  // ! ****************************************************for copy paste api*********************************************************

  const handleFetchCopypaste = async (data, userEmail) => {
    try {
      setBotLoading(true);
      const response = await handleFetchCP(data, userEmail);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: data,
          fromBot: false,
        },
      ]);
      console.log("File uploaded successfully", response.status);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: response.status,
          fromBot: false,
        },
      ]);
      toast.success("Successfully fetched");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "An error occurred while processing your request.",
          fromBot: true,
        },
      ]);
    } finally {
      setBotLoading(false);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };
  const clearFileSelection = () => {
    setSelectedFile(null);
    setSelectedFileName("");
    localStorage.removeItem("selectedFile");
    localStorage.removeItem("selectedFileName");
  };

  return (
    <Box
      className="chatbot"
      sx={{
        position: "fixed",
        bottom: { xs: "25%", sm: "25%", md: "25%", lg: "27%", xl: "27%" },
        right: { xs: "5%", sm: "5%", md: "6%", lg: "6%", xl: "7%" },
        backgroundColor: "white",
        border: "1px solid #ccc",
        width: { xs: "65%", sm: "50%", md: "35%", lg: "33%", xl: "30%" },
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(5,5,5,99%)",
        zIndex: 1000,
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
          backgroundColor: "#058719cf",
          borderRadius: "15px 15px 0px 0px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "2rem", color: "white" }}>Zenbot</h2>
      </Box>

      {/* Message container */}
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          padding: "10px",
          margin: 0,
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {/* bot response msg initialy  */}
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: message.fromBot ? "flex-start" : "flex-end",
              marginBottom: "10px",
            }}
          >
            <Box component="p" sx={{ display: "flex", alignItems: "end" }}>
              {message.fromBot && <TbMessageChatbot size={30} color="green" />}
              <Box
                sx={{
                  backgroundColor: message.fromBot ? "#dbd7d77d" : "#058719cf",
                  padding: "5px 15px",
                  borderRadius: message.fromBot
                    ? "20px 20px 20px 0px"
                    : "20px 20px 0px 20px ",
                }}
              >
                {message.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
        {isBotLoading && (
          <Box
            key={-1}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
            }}
          >
            <Box component="p" sx={{ display: "flex", alignItems: "end" }}>
              <TbMessageChatbot size={30} color="green" />
              <Box
                sx={{
                  backgroundColor: "#dbd7d77d",
                  padding: "5px 15px",
                  borderRadius: "20px 20px 20px 0px",
                }}
              >
                <div>Loading your request...</div>
              </Box>
            </Box>
          </Box>
        )}
        {/* bot message end */}
        <div ref={messagesEndRef} />
      </Box>
      {/* content Stuct end */}
      {/* input user send stuct start */}
      <Box
        className="chat-input"
        sx={{
          padding: "10px",
          borderTop: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
        }}
      >
        <textarea
          id="user-input"
          placeholder="options..."
          spellCheck="false"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
          disabled={isBotLoading}
        ></textarea>

        {messages[messages.length - 1]?.text.toLowerCase() ===
        "please paste your job description...".toLowerCase() ? (
          input.length > 10 ? (
            <Button
              variant="text"
              onClick={async () => await handleFetchCopypaste(input, userEmail)}
              disabled={isBotLoading}
            >
              fetch
            </Button>
          ) : input.trim() ? (
            <Button onClick={handleSend} disabled={isBotLoading}>
              <img
                src={sendButton}
                alt="send"
                style={{ width: "35px", height: "35px" }}
              />
            </Button>
          ) : null
        ) : messages[messages.length - 1]?.text.toLowerCase() ===
          "please upload the job description and wait while we process your request...".toLowerCase() ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={isBotLoading}
            />
            <IconButton color="primary" onClick={handleButtonClick}>
              <AttachFileIcon />
            </IconButton>
            {selectedFile ? (
              <>
                <Button
                  variant="text"
                  onClick={() => handleFetch(selectedFile, userEmail)}
                  disabled={isBotLoading}
                >
                  fetch
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "green", marginRight: "5px" }}>
                    {selectedFileName}
                  </span>
                  <IconButton
                    sx={{ width: "10px", height: "10px" }}
                    onClick={clearFileSelection}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              input.trim() && (
                <Button onClick={handleSend} disabled={isBotLoading}>
                  <img
                    src={sendButton}
                    alt="send"
                    style={{ width: "35px", height: "35px" }}
                  />
                </Button>
              )
            )}
          </>
        ) : messages[messages.length - 1]?.text.toLowerCase() ===
          "type your query".toLowerCase() ? (
          <>
            {input.length === 1 ? (
              <Button onClick={handleSend} disabled={isBotLoading}>
                <img
                  src={sendButton}
                  alt="send"
                  style={{ width: "35px", height: "35px" }}
                />
              </Button>
            ) : (
              input.length > 1 && (
                <Button
                  onClick={() => handleSearch(input, userEmail)}
                  disabled={isBotLoading}
                >
                  <img
                    src={SearchIcon}
                    alt="search"
                    style={{ width: "35px", height: "35px" }}
                  />
                </Button>
              )
            )}
          </>
        ) : messages.length > 0 &&
          messages[messages.length - 1].text.toLowerCase() ===
            "upload your file to validate and wait till we process".toLowerCase() ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              accept="image/*"
              style={{ display: "none" }}
            />
            <IconButton
              color="primary"
              onClick={() => fileInputRef.current.click()}
              aria-label="upload"
            >
              <AttachFileIcon />
            </IconButton>
            {selectedFile ? (
              <>
                <Button
                  variant="text"
                  // onClick={() => handleImageUpload(selectedFile, userEmail)}
                  onClick={() => handleImageUpload(selectedFile)}
                  disabled={isBotLoading}
                >
                  Check
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "green", marginRight: "5px" }}>
                    {selectedFileName}
                  </span>
                  <IconButton
                    sx={{ width: "10px", height: "10px" }}
                    onClick={clearFileSelection}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </>
            ) : null}
          </>
        ) : input.trim() ? (
          <Button onClick={handleSend} disabled={isBotLoading}>
            <img
              src={sendButton}
              alt="send"
              style={{ width: "35px", height: "35px" }}
            />
          </Button>
        ) : null}
        {/* {messages[messages.length - 1]?.text.toLowerCase() ===
        "please paste your job description...".toLowerCase() ? (
          input.length > 10 ? (
            <Button
              variant="text"
              onClick={async () => await handleFetchCopypaste(input, userEmail)}
              disabled={isBotLoading}
            >
              fetch
            </Button>
          ) : input.trim() ? (
            <Button onClick={handleSend} disabled={isBotLoading}>
              <img
                src={sendButton}
                alt="send"
                style={{ width: "35px", height: "35px" }}
              />
            </Button>
          ) : null
        ) : messages[messages.length - 1]?.text.toLowerCase() ===
          "please upload the job description and wait while we process your request...".toLowerCase() ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={isBotLoading}
            />
            <IconButton color="primary" onClick={handleButtonClick}>
              <AttachFileIcon />
            </IconButton>
            {selectedFile ? (
              <>
                <Button
                  variant="text"
                  onClick={() => handleFetch(selectedFile, userEmail)}
                  disabled={isBotLoading}
                >
                  fetch
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "green", marginRight: "5px" }}>
                    {selectedFileName}
                  </span>
                  <IconButton
                    sx={{ width: "10px", height: "10px" }}
                    onClick={clearFileSelection}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </>
            ) : null}
          </>
        ) : messages[messages.length - 1]?.text.toLowerCase() ===
          "upload your file to validate and wait till we process".toLowerCase() ? (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={isBotLoading}
            />
            <IconButton color="primary" onClick={handleButtonClick}>
              <AttachFileIcon />
            </IconButton>
            {selectedFile ? (
              <>
                <Button
                  variant="text"
                  onClick={() => handleFetch(selectedFile, userEmail)}
                  disabled={isBotLoading}
                >
                  fetch
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "green", marginRight: "5px" }}>
                    {selectedFileName}
                  </span>
                  <IconButton
                    sx={{ width: "10px", height: "10px" }}
                    onClick={clearFileSelection}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              </>
            ) : null}
          </>
        ) : messages[messages.length - 1]?.text.toLowerCase() ===
          "type your query".toLowerCase() ? (
          <>
            {input.length === 1 ? (
              <Button onClick={handleSend} disabled={isBotLoading}>
                <img
                  src={sendButton}
                  alt="send"
                  style={{ width: "35px", height: "35px" }}
                />
              </Button>
            ) : (
              input.length > 1 && (
                <Button
                  onClick={() => handleSearch(input, userEmail)}
                  disabled={isBotLoading}
                >
                  <img
                    src={SearchIcon}
                    alt="search"
                    style={{ width: "35px", height: "35px" }}
                  />
                </Button>
              )
            )}
          </>
        ) : input.trim() ? (
          <Button onClick={handleSend} disabled={isBotLoading}>
            <img
              src={sendButton}
              alt="send"
              style={{ width: "35px", height: "35px" }}
            />
          </Button>
        ) : null} */}
      </Box>
      {/* input user send stuct end */}
    </Box>
  );
};

export default Chatbox;
