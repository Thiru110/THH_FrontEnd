import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./LoginPage.css";
import { loginUser, signinUser } from "../../axios/api";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const [containerClass, setContainerClass] = useState("container-ss");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: signInErrors },
  } = useForm({ mode: "onTouched" });

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    reset,
    formState: { errors: signUpErrors },
  } = useForm({ mode: "onTouched" });

  const SignUpHandler = () => {
    setContainerClass("container-ss sign-up-mode");
  };

  const SignInHandler = () => {
    setContainerClass("container-ss");
  };

  const handleSignInSubmit = (data) => {
    loginUser(data)
      .then((res) => {
        console.log(res);
        if (res.status === "Success") {
          toast.success("Login successful, get ready!");
          navigate("/home");
        } else {
          toast.error(res.message);
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.log("Error logging in:", error);
        toast.error("An error occurred while logging in");
      });
  };

  const handleSignUpSubmit = (data) => {
    signinUser(data)
      .then((res) => {
        reset();
        console.log(res);
        if (res.status === 200) {
          toast.success("Registered successfully!");
          SignInHandler();
          // navigate("/login");
        } else {
          toast.error(res.error);
          console.log(res.error);
        }
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        toast.error("An error occurred while signing up");
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="signin-signup-body">
      <div className={containerClass}>
        <div className="forms-container-ss">
          <div className="signin-signup">
            <form
              onSubmit={handleSubmitSignIn(handleSignInSubmit)}
              className="sign-in-form"
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                maxWidth={500}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h3" padding={3} textAlign={"center"}>
                  Sign In
                </Typography>
                <TextField
                  type="text"
                  variant="outlined"
                  label="Username"
                  name="username"
                  {...registerSignIn("username", {
                    required: "Username is required",
                  })}
                  sx={{ width: "300px", mb: 1, borderRadius: 5 }}
                  error={Boolean(signInErrors.username)}
                  helperText={
                    signInErrors.username && signInErrors.username.message
                  }
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  label="Password"
                  name="password"
                  {...registerSignIn("password", {
                    required: "Password is required",
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "300px", mb: 1 }}
                  error={Boolean(signInErrors.password)}
                  helperText={
                    signInErrors.password && signInErrors.password.message
                  }
                />
                <Button
                  sx={{ marginTop: 3, borderRadius: 5 }}
                  size="large"
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  Login
                </Button>
                {/* <Divider /> */}
                <Divider sx={{ width: "100%", mt: 2 }}>or</Divider>

                <Link to="/forgotpass">
                  <Button
                    marginTop={"10px"}
                    sx={{ marginTop: 1, borderRadius: 3 }}
                  >
                    Forgot password
                  </Button>
                </Link>
              </Box>
            </form>

            <form
              onSubmit={handleSubmitSignUp(handleSignUpSubmit)}
              className="sign-up-form"
            >
              <Box
                display={"flex"}
                flexDirection={"column"}
                maxWidth={500}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="h3" padding={3} textAlign={"center"}>
                  Sign Up
                </Typography>
                <TextField
                  type="text"
                  variant="outlined"
                  label="Username"
                  name="username"
                  {...registerSignUp("username", {
                    required: "Username is required",
                  })}
                  sx={{ width: "300px", mb: 1 }}
                  error={Boolean(signUpErrors.username)}
                  helperText={
                    signUpErrors.username && signUpErrors.username.message
                  }
                />
                <TextField
                  type="email"
                  variant="outlined"
                  label="Email"
                  name="email"
                  {...registerSignUp("email", {
                    required: "Email is required",
                  })}
                  sx={{ width: "300px", mb: 1 }}
                  error={Boolean(signUpErrors.email)}
                  helperText={signUpErrors.email && signUpErrors.email.message}
                />
                <TextField
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  label="Password"
                  name="password"
                  {...registerSignUp("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: "300px", mb: 1 }}
                  error={Boolean(signUpErrors.password)}
                  helperText={
                    signUpErrors.password && signUpErrors.password.message
                  }
                />
                <Button
                  sx={{ marginTop: 3, borderRadius: 5 }}
                  size="large"
                  variant="contained"
                  color="success"
                  type="submit"
                >
                  Sign Up
                </Button>
              </Box>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content-ss">
              <h3>
                "The future belongs to those who believe in the beauty of their
                dreams." – Eleanor Roosevelt
              </h3>
              <p>
                Join us and be a part of the pozent community. Complete your
                sign-up to unlock your potential and access the full range of
                our website's features.
              </p>
              <Button
                className="btn-ss transparent"
                id="sign-up-btn"
                onClick={SignUpHandler}
              >
                Sign up
              </Button>
            </div>
            <img src="img/log.svg" className="image-ss" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content-ss">
              <h3>Already Have an Account</h3>
              <p>
                Welcome to our Pozent website. Signin to access a world of
                opportunities and explore the full potential of our platform.
              </p>
              <Button
                className="btn-ss transparent"
                id="sign-in-btn"
                onClick={SignInHandler}
              >
                Sign in
              </Button>
            </div>
            <img src="img/register.svg" className="image-ss" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
