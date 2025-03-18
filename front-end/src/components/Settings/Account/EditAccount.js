// components/Settings/EditAccount.js
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
      <div className="text-center py-5">
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

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
    <div className="content container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Đổi mật khẩu</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
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
