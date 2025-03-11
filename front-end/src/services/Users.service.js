import { instance } from "../configs/axios.config";

class UsersService {
  static async getAllUsers() {
    return await instance.get("/users");
  }

  static async updateUser(userId, updatedUser) {
    return await instance.put(`/users/${userId}`, updatedUser);
  }

  static async deleteUser(userId) {
    return await instance.delete(`/users/${userId}`);
  }

  static async addUser(newUser) {
    return await instance.post("/users", newUser);
  }
}

export default UsersService;
