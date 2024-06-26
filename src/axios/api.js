import api from "./axiosConfig";

export const loginUser = async (data) => {
  try {
    const response = await api.post("/user/signin", data);
    console.log(response);
    if (response.data.status === "Success") {
      SetLocalStorageToken(response.data?.token);
      console.log(response.data?.token);
    }
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const signinUser = async (data) => {
  try {
    const response = await api.post("/user/signup", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const changePass = async (data) => {
  try {
    const response = await api.post("/user/changepass", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const CheckToken = async () => {
  try {
    const response = await api.get("/user/auth");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const checkDataFR = async (email) => {
  try {
    const response = await api.get("/get-job-details", {
      params: { email },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const checkDataLE = async (email) => {
  try {
    const response = await api.get("/get-link-details", {
      params: { email },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const checkDataDV = async (email) => {
  try {
    const response = await api.get("/get-validation-details", {
      params: { email },
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// export const generateResponse = async () => {
//   try {
//     const response = await api.post("/response");
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
export const handleFetchCP = async (text, email) => {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("text", text);
    // formData.append("file_path", "python dev.txt");

    const response = await api.post("/extract_keywords", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const SetLocalStorageToken = (token) => {
  localStorage.setItem("Token", token);
};
