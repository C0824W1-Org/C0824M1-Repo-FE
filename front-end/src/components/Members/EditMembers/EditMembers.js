import React, { useState, useEffect } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditMembers = () => {
  const navigate = useNavigate();
  const { memberId } = useParams(); // Lấy memberId từ URL
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin nhân viên khi component mount
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await UsersService.getAllUsers();
        const member = response.find((user) => user.id === parseInt(memberId));
        if (member) {
          setFormData({
            username: member.username || "",
            password: member.password || "",
            role: member.role || "admin",
            personalInfo: {
              fullName: member.personalInfo?.fullName || "",
              dateOfBirth: member.personalInfo?.dateOfBirth || "",
              address: member.personalInfo?.address || "",
              phone: member.personalInfo?.phone || "",
              job: member.personalInfo?.job || "Quản trị",
            },
          });
        } else {
          setError("Không tìm thấy nhân viên với ID này");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin nhân viên");
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

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
      await UsersService.updateUser(memberId, formData);
      toast.success("Cập nhật thông tin nhân viên thành công!");
      navigate("/admin/list-members");
    } catch (err) {
      console.error("Lỗi khi cập nhật nhân viên:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi cập nhật thông tin nhân viên."
      );
    }
  };

  // Xử lý hủy bỏ
  const handleCancel = () => {
    navigate("/admin/list-members");
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải thông tin nhân viên...</div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Cập nhật nhân viên
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
                <i className="bi bi-check-circle-fill"></i> Cập nhật nhân viên
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

export default EditMembers;
