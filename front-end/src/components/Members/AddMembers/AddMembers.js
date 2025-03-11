import React, { useState } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";

const AddMembers = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
    username: "newuser", // Giá trị mặc định, không sửa được
    password: "default123", // Giá trị mặc định, không sửa được
    role: "admin",
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      job: "Quản trị", // Giá trị mặc định cho select
    },
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UsersService.addUser(formData);
      toast.success("Thêm nhân viên thành công!");
      onPageChange("ListMembers");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thêm nhân viên.");
    }
  };

  const handleCancel = () => {
    onPageChange("ListMembers");
  };

  return (
    <div className="content container-fluid">
      <h2>Thêm nhân viên</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label>Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                disabled
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
              <label>Họ và tên</label>
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
              <label>Ngày sinh</label>
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
              <label>Địa chỉ</label>
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
              <label>Số điện thoại</label>
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
