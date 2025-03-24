import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../services/Customers.service";
import { toast } from "react-toastify";

const AddCustomers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    age: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.address ||
      !formData.age
    ) {
      toast.error(
        "Vui lòng nhập đầy đủ các trường bắt buộc: Họ và tên, Số điện thoại, Địa chỉ, Tuổi."
      );
      return;
    }

    try {
      await CustomersService.addCustomer({
        ...formData,
        age: formData.age ? parseInt(formData.age) : "",
      });
      toast.success("Thêm khách hàng thành công!");
      navigate("/admin/list-customers");
    } catch (err) {
      toast.error(`Có lỗi khi thêm khách hàng: ${err.message}`);
      console.error("Lỗi thêm khách hàng:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/list-customers");
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Thêm khách hàng
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Họ và tên */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
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
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              {/* Tuổi */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Tuổi <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Nhập tuổi"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email (ví dụ: customer@domain.com)"
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
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle-fill"></i> Thêm khách hàng
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

export default AddCustomers;
