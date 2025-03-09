import { instance } from "../configs/axios.config";

class AppService {
  static async login(credentials) {
    return await instance.post("/login", credentials);
  }

  static async getAllEmployees() {
    return await instance.get("/employees");
  }

  static async getAllProducts() {
    return await instance.get("/products");
  }

  static async getAllSuppliers() {
    return await instance.get("/suppliers");
  }

  static async getAllSales() {
    return await instance.get("/sales");
  }
}

export default AppService;
