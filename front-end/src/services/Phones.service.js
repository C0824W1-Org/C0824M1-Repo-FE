import { instance } from "../configs/axios.config";

class PhonesService {
  static async getAllPhones() {
    return await instance.get("/phones");
  }
}

export default PhonesService;
