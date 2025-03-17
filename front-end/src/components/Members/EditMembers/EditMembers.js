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
    role: "",
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      job: "",
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
            username: member.username,
            password: member.password,
            role: member.role,
            personalInfo: { ...member.personalInfo },
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
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Chỉnh sửa nhân viên</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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

export default EditMembers;
