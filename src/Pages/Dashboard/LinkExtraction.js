import React, { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../axios/axiosConfig";
import { FaDownload } from "react-icons/fa6";
// Styled component for TableCell
const StyledTableCell = styled(TableCell)({
  // fontSize:"20px",
  border: "2px solid black",
});
const StyledNavLink = styled(NavLink)({
  textDecoration: "none",
  // color: "#fff",
  fontSize: 20,
  paddingRight: 10,
});

const LinkExtraction = () => {
  const user = useSelector((state) => state.auth.user);
  const [selectedEmail, setSelectedEmail] = useState(
    user.role === "user" ? user.email : ""
  );
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobIds, setJobIds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]); // Added this line

  const location = useLocation();
  const { data: jsonData } = location.state || {};

  useEffect(() => {
    if (jsonData) {
      try {
        const parsedData = JSON.parse(jsonData);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON data:", error);
      }
    }
  }, [jsonData]);

  useEffect(() => {
    if (selectedEmail) {
      const selectedData = data.find((job) => job.email === selectedEmail);
      if (selectedData) {
        const ids = selectedData.job_ids.split("\n").map((id) => id.trim());
        setJobIds(ids);
      } else {
        setJobIds([]);
      }
    } else {
      setJobIds([]);
    }
  }, [selectedEmail, data]);

  const handleSearchClick = async () => {
    const url = "/link_extracting";
    const params = {
      filters: {
        user_type: user.role === "admin" ? "admin" : "user",
        job_id: selectedJobId || "",
        email: selectedEmail === "No Email" ? "" : selectedEmail,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null,
      },
      fetch_resume: "candidate_info",
    };

    try {
      const response = await axiosInstance.post(url, params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      const result = response.data;

      if (result.status === "Success") {
        setSearchResults(result.data);
        console.log(result.data);
        toast.success("Data fetched based on your filters");
      } else {
        console.error("Search API call failed:", result.status);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get("/download_links", {
        params: {
          job_id: selectedJobId,
          email: selectedEmail,
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null,
        },
        responseType: "blob", // Ensure response type is blob to handle file download
      });

      // Create a blob object from the response data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a link element, set its href and download attributes, then click it programmatically
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "LE_Resume.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Optionally display a success message or handle UI changes
      console.log("File download successful");
    } catch (error) {
      console.error("Error downloading file:", error);
      // Optionally display an error message or handle error state
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "15px",
            gap: 2,
          }}
        >
          <TextField
            select
            label="Select Email"
            value={selectedEmail}
            onChange={(e) =>
              setSelectedEmail(
                e.target.value === "No Email" ? "" : e.target.value
              )
            }
            sx={{ width: 150 }}
          >
            {Array.isArray(data) && data.length > 0 ? (
              data.map((job) => (
                <MenuItem
                  key={job.email || "default"}
                  value={job.email || "No Email"}
                >
                  {job.email || "No Email"}
                </MenuItem>
              ))
            ) : (
              <MenuItem key="default" value="No Email">
                No Email
              </MenuItem>
            )}
          </TextField>

          <TextField
            select
            label="JOB ID"
            value={selectedJobId}
            variant="standard"
            onChange={(e) => setSelectedJobId(e.target.value)}
            sx={{ width: 150 }}
            disabled={!selectedEmail}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.isArray(jobIds) &&
              jobIds.map((id, index) => (
                <MenuItem key={index} value={id}>
                  {id}
                </MenuItem>
              ))}
          </TextField>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: 150 }} />
              )}
            />
            {startDate && (
              <IconButton onClick={() => setStartDate(null)}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: 150 }} />
              )}
            />
            {endDate && (
              <IconButton onClick={() => setEndDate(null)}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Box>
      </LocalizationProvider>

      <FaDownload
        size={30}
        style={{ float: "right", marginRight: "130px", cursor: "pointer" }}
        onClick={handleDownload}
      />

      <div>{/* here need to add message*/}</div>

      {/* TableContainer and Table component */}
      <TableContainer
        // component={Paper}
        sx={{ overflowX: "auto", padding: "15px 150px" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Link</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell align="left" component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Click">
                      <StyledNavLink
                        to={row.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </StyledNavLink>
                    </Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={6} align="center">
                  No data available
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LinkExtraction;
