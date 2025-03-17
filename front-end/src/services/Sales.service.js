import { instance } from "../configs/axios.config";

class SalesService {
  static async getAllSales() {
    try {
      const sales = await instance.get("/sales");
      return sales; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi lấy danh sách giao dịch:", error.message || error);
      throw error;
    }
  }

  static async getSaleById(saleId) {
    try {
      const sale = await instance.get(`/sales/${saleId}`);
      return sale; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi lấy giao dịch:", error.message || error);
      throw error;
    }
  }

  static async addSale(saleData) {
    try {
      const newSale = await instance.post("/sales", saleData);
      return newSale; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error.message || error);
      throw error;
    }
  }

  static async updateSale(saleId, saleData) {
    try {
      const updatedSale = await instance.put(`/sales/${saleId}`, saleData);
      return updatedSale; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi cập nhật giao dịch:", error.message || error);
      throw error;
    }
  }

  static async deleteSale(saleId) {
    try {
      const result = await instance.delete(`/sales/${saleId}`);
      return result; // Interceptor trả về response.data (thường là {})
    } catch (error) {
      console.error("Lỗi khi xóa giao dịch:", error.message || error);
      throw error;
    }
  }
}

export default SalesService;
