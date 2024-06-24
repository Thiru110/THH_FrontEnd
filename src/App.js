import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import { LoginPage } from "./Pages/Loginpage/LoginPage";
import HomePage from "./Pages/HomePage";
import { ToastContainer } from "react-toastify";
import ForgotPassPage from "./Pages/ForgotPassPage";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./Layout/RootLayout";
import FetchResume from "./Pages/Dashboard/FetchResume";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Validation from "./Pages/Dashboard/Validation";
import LinkExtraction from "./Pages/Dashboard/LinkExtraction";
import { Loader } from "./CommonComp/LoaderComponent/loader";

const theme = createTheme({
  palette: {
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ height: "100vh", width: "100vw" }}>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgotpass" element={<ForgotPassPage />} />
            <Route path="/load" element={<Loader />} />
            <Route path="/home" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="fetchresume" element={<FetchResume />} />
              <Route path="validation" element={<Validation />} />
              <Route path="linkextraction" element={<LinkExtraction />} />
            </Route>
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
