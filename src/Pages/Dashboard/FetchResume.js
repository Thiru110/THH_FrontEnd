import React, { useEffect } from "react";
import {
  Button,
  MenuItem,
  // Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  ButtonBase,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSelector } from "react-redux";
import mailIcon from "../../Utils/mailIcon.png";
import downloadIcon from "../../Utils/downloadIcon.png";
// import releventBtn from "../../Utils/RelevantRank.gif";
import releventBtn from "../../Utils/RRButton.png";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import axiosInstance from "../../axios/axiosConfig";

const StyledTableCell = styled(TableCell)({
  border: "2px solid black",
});

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.white,
//     color: theme.palette.common.black,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));
const ImageButton = styled(ButtonBase)(({ theme }) => ({
  "& img": {
    width: "auto",
    height: "auto",
    maxWidth: "30px",
    maxHeight: "30px",
    transition: "transform 0.2s ease",
  },
  "&:hover img": {
    transform: "scale(1.2)",
    zIndex: 1,
  },
}));
// !   component start
const FetchResume = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const { data: jsonData } = location.state || {};

  const [data, setData] = useState([]);
  const [jobIds, setJobIds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  // const [selectedRowEmail, setSelectedRowEmail] = useState("");
  // console.log(selectedRowEmail);
  const [selectedEmail, setSelectedEmail] = useState(
    user.role === "user" ? user.email : ""
  );
  const [selectedJobId, setSelectedJobId] = useState("");
  console.log(selectedJobId);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [percentageMap, setPercentageMap] = useState({}); // State to store percentage for each row

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

  // ! for search button api req and add data to the table
  const handleSearchClick = async () => {
    const url = "/fetch_candidates"; // Ensure the correct protocol is used
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

  // ! in table download button api req
  const handleDownloadClick = async (email) => {
    const url = `/download_api_resumes?email=${encodeURIComponent(
      email
    )}&jd_id=${encodeURIComponent(selectedJobId)}`;

    try {
      const response = await axiosInstance.get(url, {
        responseType: "blob", // Important to get the response as a blob
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `resume_${email}.txt`; // Set the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl); // Clean up the URL object
    } catch (error) {
      console.error("Error during download request:", error);
    }
  };
  const handleMailClick = (email, name) => {
    const url = `/send-invitation?email=${encodeURIComponent(
      email
    )}&name=${encodeURIComponent(name)}`;
    console.log("Sending request to:", url); // Debugging log

    axiosInstance
      .post(url)
      .then((response) => {
        console.log("Mail response:", response.data);
        toast.success("mail send successfully");
      })
      .catch((error) => {
        console.error("Error during mail request:", error);
        if (error.response) {
          console.error("Error response data:", error.response.data);
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error("An unknown error occurred.");
        }
      });
  };
  const handleRelevantExperienceClick = async (name, jobId, email) => {
    const url = `/Relevant?name=${encodeURIComponent(
      name
    )}&job_id=${encodeURIComponent(jobId)}`;

    try {
      const response = await axiosInstance.post(url);
      const result = response.data;

      if (result.status === "Success") {
        const updatedMap = { ...percentageMap };
        updatedMap[email] = result.relevent_experience;
        setPercentageMap(updatedMap);
        toast.success(`Relevant Experience: ${result.relevent_experience}`);
      } else {
        console.error("Relevant Experience API call failed:", result.status);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error during Relevant Experience API call:", error);
      toast.error(error.response.data.message);
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
      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            label="JD ID"
            value={selectedJobId}
            variant="standard"
            onChange={(e) => setSelectedJobId(e.target.value)}
            sx={{ width: 150 }}
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
      </LocalizationProvider> */}

      <TableContainer
        // component={Paper}
        sx={{ overflowX: "auto", padding: "15px 150px" }}
      >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">
                Percentage&nbsp;(%)
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                Actions
              </StyledTableCell>
              <StyledTableCell align="center">Relevant Ranking</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              searchResults.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.Name}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.Email}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row.Similarity}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Download">
                      <ImageButton
                        onClick={async () => {
                          // setSelectedRowEmail(row.Email); // Set the selected row's email
                          await handleDownloadClick(row.Email);
                        }}
                      >
                        <img
                          src={downloadIcon}
                          alt="Download Icon"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "25px",
                            maxHeight: "25px",
                          }}
                        />
                      </ImageButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Mail">
                      <ImageButton
                        onClick={() => {
                          // setSelectedRowEmail(row.Email); // Set the selected row's email
                          handleMailClick(row.Email, row.Name);
                        }}
                      >
                        <img
                          src={mailIcon}
                          alt="Mail Icon"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "25px",
                            maxHeight: "25px",
                          }}
                        />
                      </ImageButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Please fill a Job ID to enable Relevant Ranking">
                      <ImageButton
                        onClick={() =>
                          handleRelevantExperienceClick(
                            row.Name,
                            selectedJobId,
                            row.Email
                          )
                        }
                      >
                        <img
                          src={releventBtn}
                          alt="Relevant Experience Icon"
                          style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "30px",
                            maxHeight: "25px",
                          }}
                        />
                      </ImageButton>
                    </Tooltip>
                    {/* Display percentage here */}
                    {percentageMap[row.Email] !== undefined && (
                      <div style={{ marginTop: "5px" }}>
                        {`Relevant Experience: ${percentageMap[row.Email]}`}
                      </div>
                    )}
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

export default FetchResume;
