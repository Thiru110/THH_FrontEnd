import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../Redux/AuthSlice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import THH from "../Utils/THHlogo.png";
import { checkDataDV, checkDataFR, checkDataLE } from "../axios/api";
const StyledNavLink = styled(NavLink)({
  textDecoration: "none",
  color: "#fff",
  fontSize: 20,
  paddingRight: 10,
});
// from mui
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElDashboard, setAnchorElDashboard] = React.useState(null);

  const user = useSelector((state) => state.auth.user);

  const handleMenuClick = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  // for Avathar open
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  // Avathar close
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // dashboard open
  const handleOpenDashboardMenu = (event) => {
    setAnchorElDashboard(event.currentTarget);
  };
  // dashboard close
  const handleCloseDashboardMenu = () => {
    setAnchorElDashboard(null);
  };
  const HandlefetchResume = () => {
    checkDataFR(user.email)
      // .then((response) => response.json())
      .then((res) => {
        console.log("Fetch Resume response:", res);
        if (res.status === "Success") {
          toast.success(res.message);
          navigate("/home/fetchresume", { state: { data: res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during fetch resume request:", error);
        toast.error(error.response.data.message);
      });
  };

  // ! need to integrate
  const HandleLinkExtraction = () => {
    checkDataLE(user.email)
      // .then((response) => response.json())
      .then((res) => {
        console.log("Link Extraction response:", res);
        if (res.status === "Success") {
          toast.success(res.message);
          navigate("/home/linkextraction", { state: { data: res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during Link Extraction request:", error);
        toast.error(error.response.data.message);
      });
  };
  const HandleDataValidation = () => {
    checkDataDV(user.email)
      // .then((response) => response.json())
      .then((res) => {
        console.log("Data Validation response:", res);
        if (res.status === "Success") {
          toast.success(res.message);
          navigate("/home/validation", { state: { data: res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during Link Extraction request:", error);
        toast.error(error.response.data.message);
      });
  };

  const currentPath = location.pathname;
  const isDashboardPage =
    /^\/home\/(fetchresume|linkextraction|validation)$/.test(currentPath);

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#3778a6", height: "64px" }}>
        {/* <AppBar position="fixed" sx={{ bgcolor: "#2ca68d", height: "64px" }}> */}
        <Container maxWidth={false} disableGutters>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "25%",
                justifyContent: "flex-start",
                overflow: "hidden",
              }}
            >
              <img
                src={THH}
                alt="Logo"
                style={{ height: "64px", width: "100px" }}
              />
            </div>
            <div
              style={{
                width: "75%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {isDashboardPage && (
                <div style={{ marginRight: "10px" }}>
                  <StyledNavLink to="/home" sx={{ color: "#fff" }}>
                    Home
                  </StyledNavLink>
                </div>
              )}
              <div style={{ marginRight: "19px" }}>
                <Typography
                  onMouseEnter={handleOpenDashboardMenu}
                  sx={{
                    // cursor: "pointer",
                    color: "#fff",
                    fontSize: 20,
                  }}
                >
                  Dashboard
                </Typography>
                <Menu
                  id="dashboard-menu"
                  anchorEl={anchorElDashboard}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElDashboard)}
                  onClose={handleCloseDashboardMenu}
                  MenuListProps={{
                    onMouseLeave: handleCloseDashboardMenu,
                  }}
                >
                  <MenuItem
                    onClick={HandlefetchResume}
                    sx={{
                      color:
                        currentPath === "/home/fetchresume"
                          ? "primary.main"
                          : "black",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    Fetch Resume
                  </MenuItem>
                  <MenuItem
                    onClick={HandleLinkExtraction}
                    sx={{
                      color:
                        currentPath === "/home/linkextraction"
                          ? "primary.main"
                          : "black",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    Link Extraction
                  </MenuItem>
                  {/* <MenuItem
                    onClick={HandleDataValidation}
                    sx={{
                      color:
                        currentPath === "/home/validation"
                          ? "primary.main"
                          : "black",
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    Validation
                  </MenuItem> */}
                </Menu>
              </div>
              <div>
                <StyledNavLink to="https://pozent.com/">Contact</StyledNavLink>
              </div>
              <div style={{ width: "100px", textAlign: "center" }}>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={`${user.email}`}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => handleMenuClick()}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </div>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
