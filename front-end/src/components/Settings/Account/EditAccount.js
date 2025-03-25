import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UsersService from "../../../services/Users.service";
import { login } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditAccount = () => {
  const navigate = useNavigate();
  const { userLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State cho mật khẩu mới
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Kiểm tra nếu không có thông tin người dùng
  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-3" style={{ fontSize: "0.85rem" }}>
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const { username, role } = userLogin;

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const updatedUser = {
        ...userLogin,
        password: newPassword, // Cập nhật mật khẩu mới
      };

      // Cập nhật dữ liệu lên server
      await UsersService.updateUser(userLogin.id, updatedUser);
      // Cập nhật Redux store
      dispatch(login(updatedUser));
      // Cập nhật localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Đổi mật khẩu thành công!");
      navigate("/admin/settings");
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error("Có lỗi xảy ra khi đổi mật khẩu.");
    }
  };

  // Xử lý khi hủy
  const handleCancel = () => {
    navigate("/admin/settings");
  };

  return (
    <div className="container py-2">
      <div
        className="card shadow-lg rounded-3 border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-3">
          <h5
            className="card-title fw-bold mb-3 text-center"
            style={{ fontSize: "1.1rem" }}
          >
            Đổi mật khẩu
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th
                      scope="row"
                      style={{ width: "30%", fontSize: "0.85rem" }}
                      className="fw-bold"
                    >
                      Tên đăng nhập
                    </th>
                    <td style={{ fontSize: "0.85rem" }}>{username}</td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      style={{ fontSize: "0.85rem" }}
                      className="fw-bold"
                    >
                      Vai trò
                    </th>
                    <td style={{ fontSize: "0.85rem" }}>{role}</td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      style={{ fontSize: "0.85rem" }}
                      className="fw-bold"
                    >
                      Mật khẩu mới
                    </th>
                    <td>
                      <input
                        type="password"
                        className="form-control shadow-sm rounded-3"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          maxWidth: "300px",
                          fontSize: "0.85rem",
                          padding: "5px 10px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      style={{ fontSize: "0.85rem" }}
                      className="fw-bold"
                    >
                      Xác nhận mật khẩu
                    </th>
                    <td>
                      <input
                        type="password"
                        className="form-control shadow-sm rounded-3"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          maxWidth: "300px",
                          fontSize: "0.85rem",
                          padding: "5px 10px",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-3 py-1 d-flex align-items-center gap-1"
                style={{ fontSize: "0.85rem" }}
              >
                <i className="bi bi-check-circle-fill"></i>
                Lưu
              </button>
              <button
                type="button"
                className="btn btn-secondary fw-bold px-3 py-1 d-flex align-items-center gap-1"
                onClick={handleCancel}
                style={{ fontSize: "0.85rem" }}
              >
                <i
                  className="bi bi-x-circle-fill"
                  style={{ fontSize: "0.85rem" }}
                ></i>{" "}
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
