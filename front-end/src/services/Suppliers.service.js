import { instance } from "../configs/axios.config";

class SuppliersService {
  static async getAllSuppliers() {
    return await instance.get("/suppliers");
  }

  static async addSupplier(newSupplier) {
    return await instance.post("/suppliers", newSupplier);
  }

  static async updateSupplier(supplierId, updatedSupplier) {
    return await instance.put(`/suppliers/${supplierId}`, updatedSupplier);
  }

  static async deleteSupplier(supplierId) {
    try {
      const response = await instance.delete(`/suppliers/${supplierId}`);
      return response;
    } catch (error) {
      console.error(
        "Lỗi khi xóa nhà cung cấp:",
        error.response || error.message
      );
      throw error;
    }
  }
}

export default SuppliersService;
