import { instance } from "../configs/axios.config";

class ProductsService {
  static async getAllProducts() {
    return await instance.get("/phones");
  }

  static async addProduct(newProduct) {
    return await instance.post("/phones", newProduct);
  }

  static async updateProduct(productId, updatedProduct) {
    return await instance.put(`/phones/${productId}`, updatedProduct);
  }

  static async deleteProduct(productId) {
    try {
      const response = await instance.delete(`/phones/${productId}`);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa hàng hóa:", error.response || error.message);
      throw error;
    }
  }
}

export default ProductsService;
