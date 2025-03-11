import React, { useState } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";

const AddProducts = ({ onPageChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "Apple", // Giá trị mặc định
    price: "",
    cpu: "",
    storage: "",
    os: "",
    battery: "",
    screenSize: "",
    camera: "",
    color: "",
    quantity: "",
    description: "",
    image: "",
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
      await ProductsService.addProduct({
        ...formData,
        price: parseInt(formData.price), // Chuyển thành số
        quantity: parseInt(formData.quantity), // Chuyển thành số
      });
      toast.success("Thêm hàng hóa thành công!");
      onPageChange("ListProducts");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thêm hàng hóa.");
    }
  };

  const handleCancel = () => {
    onPageChange("ListProducts");
  };

  return (
    <div className="content container-fluid">
      <h2>Thêm hàng hóa</h2>
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
                Thêm hàng hóa
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

export default AddProducts;
