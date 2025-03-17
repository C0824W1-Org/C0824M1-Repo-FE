import React, { useState, useEffect } from "react";
import SuppliersService from "../../../services/Suppliers.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditSuppliers = () => {
  const navigate = useNavigate();
  const { supplierId } = useParams(); // Lấy supplierId từ URL
  const [formData, setFormData] = useState({
    supplierCode: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin nhà cung cấp khi component mount
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await SuppliersService.getAllSuppliers();
        const supplier = response.find((s) => s.id === parseInt(supplierId));
        if (supplier) {
          setFormData({
            supplierCode: supplier.supplierCode,
            name: supplier.name,
            address: supplier.address,
            phone: supplier.phone,
            email: supplier.email,
          });
        } else {
          setError("Không tìm thấy nhà cung cấp với ID này");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin nhà cung cấp");
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
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
      await SuppliersService.updateSupplier(supplierId, formData);
      toast.success("Cập nhật nhà cung cấp thành công!");
      navigate("/admin/list-suppliers");
    } catch (err) {
      console.error(
        "Lỗi khi cập nhật nhà cung cấp:",
        err.response || err.message
      );
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi cập nhật nhà cung cấp."
      );
    }
  };

  // Xử lý hủy bỏ
  const handleCancel = () => {
    navigate("/admin/list-suppliers");
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải thông tin nhà cung cấp...</div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Sửa thông tin nhà cung cấp</h2>
      <div className="card shadow-sm">
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

export default EditSuppliers;
