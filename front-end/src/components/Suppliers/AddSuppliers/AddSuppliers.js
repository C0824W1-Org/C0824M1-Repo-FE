import React, { useState } from "react";
import SuppliersService from "../../../services/Suppliers.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddSuppliers = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierCode: "",
    name: "",
    address: "",
    phone: "",
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
    if (
      !formData.supplierCode ||
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin nhà cung cấp.");
      return;
    }

    try {
      await SuppliersService.addSupplier(formData);
      toast.success("Thêm nhà cung cấp thành công!");
      navigate("/admin/list-suppliers");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thêm nhà cung cấp.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/list-suppliers");
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Thêm nhà cung cấp
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Mã nhà cung cấp */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Mã nhà cung cấp <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="supplierCode"
                  value={formData.supplierCode}
                  onChange={handleChange}
                  placeholder="Nhập mã nhà cung cấp (ví dụ: NCC001)"
                  required
                />
              </div>

              {/* Tên */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên nhà cung cấp"
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

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email (ví dụ: contact@company.com)"
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
                <i className="bi bi-plus-circle-fill"></i> Thêm nhà cung cấp
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

export default AddSuppliers;
