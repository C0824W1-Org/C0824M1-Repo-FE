import { instance } from "../configs/axios.config";

class CustomersService {
  static async getAllCustomers() {
    try {
      const customers = await instance.get("/customers");
      return customers; // Interceptor trả về response.data
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách khách hàng:",
        error.message || error
      );
      throw error;
    }
  }

  static async getCustomerById(customerId) {
    try {
      const customer = await instance.get(`/customers/${customerId}`);
      return customer; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi lấy khách hàng:", error.message || error);
      throw error;
    }
  }

  static async addCustomer(newCustomer) {
    try {
      const customer = await instance.post("/customers", newCustomer);
      return customer; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi thêm khách hàng:", error.message || error);
      throw error;
    }
  }

  static async updateCustomer(customerId, updatedCustomer) {
    try {
      const customer = await instance.put(
        `/customers/${customerId}`,
        updatedCustomer
      );
      return customer; // Interceptor trả về response.data
    } catch (error) {
      console.error("Lỗi khi cập nhật khách hàng:", error.message || error);
      throw error;
    }
  }

  static async deleteCustomer(customerId) {
    try {
      const response = await instance.delete(`/customers/${customerId}`);
      return response; // Interceptor trả về response.data (thường là {})
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error.message || error);
      throw error;
    }
  }
}

export default CustomersService;
