import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";

const EditProducts = ({ onPageChange, productId }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductsService.getAllProducts();
        const product = response.find((p) => p.id === productId);
        if (product) {
          setFormData({
            ...product,
            brand: product.name.includes("iPhone") ? "Apple" : "Samsung",
          });
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin hàng hóa");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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
      await ProductsService.updateProduct(productId, {
        ...formData,
        price: parseInt(formData.price),
        quantity: parseInt(formData.quantity),
      });
      toast.success("Cập nhật hàng hóa thành công!");
      onPageChange("ListProducts");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật hàng hóa.");
    }
  };

  const handleCancel = () => {
    onPageChange("ListProducts");
  };

  if (loading) {
    return <div>Đang tải thông tin hàng hóa...</div>;
  }

  if (error || !formData) {
    return <div>{error || "Không tìm thấy thông tin hàng hóa"}</div>;
  }

  return (
    <div className="content container-fluid">
      <h2>Sửa thông tin hàng hóa</h2>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Tên</label>
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
              <label>Hãng</label>
              <select
                className="form-control"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Giá (VNĐ)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>CPU</label>
              <input
                type="text"
                className="form-control"
                name="cpu"
                value={formData.cpu}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Bộ nhớ</label>
              <input
                type="text"
                className="form-control"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Hệ điều hành</label>
              <input
                type="text"
                className="form-control"
                name="os"
                value={formData.os}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Pin</label>
              <input
                type="text"
                className="form-control"
                name="battery"
                value={formData.battery}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Kích thước màn hình</label>
              <input
                type="text"
                className="form-control"
                name="screenSize"
                value={formData.screenSize}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Camera</label>
              <input
                type="text"
                className="form-control"
                name="camera"
                value={formData.camera}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Màu sắc</label>
              <input
                type="text"
                className="form-control"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Số lượng</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Mô tả</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label>Link ảnh</label>
              <input
                type="text"
                className="form-control"
                name="image"
                value={formData.image}
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

export default EditProducts;
