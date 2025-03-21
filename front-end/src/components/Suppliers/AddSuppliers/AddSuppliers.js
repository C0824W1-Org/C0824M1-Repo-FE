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
    <div className="content container-fluid">
      <h2 className="mb-4">Thêm nhà cung cấp</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>
                Mã nhà cung cấp <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="supplierCode"
                value={formData.supplierCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
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
                value={formData.address}
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
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Thêm nhà cung cấp
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

export default AddSuppliers;
