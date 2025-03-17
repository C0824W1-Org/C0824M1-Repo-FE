import React, { useState } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddMembers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      job: "Quản trị",
    },
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.personalInfo) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!formData.username || !formData.password) {
      toast.error("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }
    if (
      !formData.personalInfo.fullName ||
      !formData.personalInfo.dateOfBirth ||
      !formData.personalInfo.address ||
      !formData.personalInfo.phone
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin cá nhân.");
      return;
    }

    try {
      await UsersService.addUser(formData);
      toast.success("Thêm nhân viên thành công!");
      navigate("/admin/list-members");
    } catch (err) {
      console.error("Lỗi khi thêm nhân viên:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi thêm nhân viên."
      );
    }
  };

  // Xử lý hủy bỏ
  const handleCancel = () => {
    try {
      navigate("/admin/list-members");
    } catch (err) {
      console.error("Lỗi khi hủy bỏ:", err);
      toast.error("Có lỗi xảy ra khi quay lại danh sách nhân viên.");
    }
  };

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Thêm nhân viên</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>
                Tên đăng nhập <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Mật khẩu <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Vai trò</label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="stockkeeper">Stockkeeper</option>
                <option value="sales">Sales</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>
                Họ và tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.personalInfo.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Ngày sinh <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={formData.personalInfo.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Địa chỉ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.personalInfo.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.personalInfo.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Chức vụ</label>
              <select
                className="form-control"
                name="job"
                value={formData.personalInfo.job}
                onChange={handleChange}
                required
              >
                <option value="Quản trị">Quản trị</option>
                <option value="Thủ kho">Thủ kho</option>
                <option value="Bán hàng">Bán hàng</option>
                <option value="Kinh doanh">Kinh doanh</option>
              </select>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Thêm nhân viên
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

export default AddMembers;
