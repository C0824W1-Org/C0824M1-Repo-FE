import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Xử lý response chung
instance.interceptors.response.use(
  (response) => response.data, // Trả về data từ response
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.message || "Có lỗi xảy ra từ server");
    } else if (error.request) {
      throw new Error("Không thể kết nối đến server");
    } else {
      throw new Error("Có lỗi xảy ra khi thiết lập request");
    }
  }
);
