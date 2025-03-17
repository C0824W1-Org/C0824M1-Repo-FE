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
    try {
      await CustomersService.addCustomer({
        ...formData,
        age: formData.age ? parseInt(formData.age) : "",
      });
      toast.success("Thêm khách hàng thành công!");
      navigate("/admin/list-customers"); // Sửa thành đường dẫn đầy đủ
    } catch (err) {
      toast.error(`Có lỗi khi thêm khách hàng: ${err.message}`);
      console.error("Lỗi thêm khách hàng:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/list-customers"); // Sửa thành đường dẫn đầy đủ
  };

  return (
    <div className="content container-fluid">
      <h2>Thêm khách hàng</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
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
                value={formData.phone}
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
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Tuổi</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Email (không bắt buộc)</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Thêm khách hàng
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

export default AddCustomers;
