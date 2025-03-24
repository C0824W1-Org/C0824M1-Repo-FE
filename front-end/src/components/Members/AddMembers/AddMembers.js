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
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Thêm nhân viên
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Tên đăng nhập */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Tên đăng nhập <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Mật khẩu <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              {/* Vai trò */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Vai trò</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="stockkeeper">Thủ kho</option>
                  <option value="sales">Bán hàng</option>
                  <option value="business">Kinh doanh</option>
                </select>
              </div>

              {/* Họ và tên */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.personalInfo.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              {/* Ngày sinh */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
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

              {/* Số điện thoại */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Số điện thoại <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.personalInfo.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              {/* Địa chỉ */}
              <div className="col-12">
                <label className="form-label fw-bold">
                  Địa chỉ <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.personalInfo.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              {/* Chức vụ */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Chức vụ</label>
                <select
                  className="form-select"
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
            </div>

            {/* Nút điều khiển */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              >
                <i className="bi bi-person-plus-fill"></i> Thêm nhân viên
              </button>
              <button
                type="button"
                className="btn btn-secondary fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={handleCancel}
              >
                <i className="bi bi-x-circle-fill"></i> Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMembers;
