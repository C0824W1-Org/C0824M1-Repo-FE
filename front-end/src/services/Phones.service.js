import { instance } from "../configs/axios.config";

class PhonesService {
  static async login(username, password) {
    try {
      console.log("Gọi API đăng nhập với:", { username, password }); // Log dữ liệu đầu vào
      const response = await instance.get("/users", {
        params: { username, password },
      });
      console.log("Kết quả từ API:", response); // Log kết quả từ API
      return response[0]; // Trả về user đầu tiên khớp với điều kiện
    } catch (error) {
      console.error("Lỗi khi gọi API đăng nhập:", error); // Log lỗi nếu có
      throw error;
    }
  }
  static async getAllPhones() {
    return await instance.get("/phones");
  }
}

export default PhonesService;
