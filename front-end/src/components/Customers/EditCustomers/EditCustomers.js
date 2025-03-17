import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomersService from "../../../services/Customers.service";
import { toast } from "react-toastify";

const EditCustomers = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await CustomersService.getCustomerById(customerId);
        if (customer) {
          setFormData({ ...customer });
        } else {
          setError("Không tìm thấy khách hàng với ID này");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin khách hàng");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

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
      await CustomersService.updateCustomer(customerId, {
        ...formData,
        age: formData.age ? parseInt(formData.age) : "",
      });
      toast.success("Cập nhật khách hàng thành công!");
      navigate("/admin/list-customers"); // Sửa thành đường dẫn đầy đủ
    } catch (err) {
      toast.error(`Có lỗi khi cập nhật khách hàng: ${err.message}`);
      console.error("Lỗi cập nhật khách hàng:", err);
    }
  };

  const handleCancel = () => {
    navigate("/admin/list-customers"); // Sửa thành đường dẫn đầy đủ
  };

  if (loading) {
    return <div>Đang tải thông tin khách hàng...</div>;
  }

  if (error || !formData) {
    return <div>{error || "Không tìm thấy thông tin khách hàng"}</div>;
  }

  return (
    <div className="content container-fluid">
      <h2>Sửa thông tin khách hàng</h2>
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
                value={formData.email || ""}
                onChange={handleChange}
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

export default EditCustomers;
