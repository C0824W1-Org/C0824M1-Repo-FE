import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditProducts = () => {
  const navigate = useNavigate();
  const { productId } = useParams(); // Lấy productId từ URL
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin sản phẩm khi component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await ProductsService.getAllProducts();
        const product = response.find((p) => p.id === parseInt(productId));
        if (product) {
          setFormData({
            ...product,
            brand:
              product.brand ||
              (product.name.includes("iPhone") ? "Apple" : "Samsung"),
          });
        } else {
          setError("Không tìm thấy sản phẩm với ID này");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin hàng hóa");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result, // Cập nhật ảnh mới bằng chuỗi Base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra các trường bắt buộc
    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error(
        "Vui lòng nhập đầy đủ các trường bắt buộc: Tên, Giá, Số lượng."
      );
      return;
    }

    try {
      const updatedProduct = {
        ...formData,
        price: parseInt(formData.price),
        quantity: parseInt(formData.quantity),
      };
      await ProductsService.updateProduct(productId, updatedProduct);
      toast.success("Cập nhật hàng hóa thành công!");
      navigate("/admin/list-products");
    } catch (err) {
      console.error("Lỗi khi cập nhật hàng hóa:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi cập nhật hàng hóa."
      );
    }
  };

  // Xử lý hủy bỏ
  const handleCancel = () => {
    navigate("/admin/list-products");
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải thông tin hàng hóa...</div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Sửa thông tin hàng hóa</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
                <option value="Oppo">Oppo</option>
                <option value="Nokia">Nokia</option>
                <option value="Pixel">Pixel</option>
                <option value="Vivo">Vivo</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>
                Giá (VNĐ) <span className="text-danger">*</span>
              </label>
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
              <label>
                Số lượng <span className="text-danger">*</span>
              </label>
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
              <label>Ảnh sản phẩm</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
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
