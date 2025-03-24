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
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Cập nhật hàng hóa
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
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
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              {/* Hãng */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Hãng</label>
                <select
                  className="form-select"
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

              {/* Giá */}
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  Giá (VNĐ) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Nhập giá"
                  required
                />
              </div>

              {/* Số lượng */}
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  Số lượng <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Nhập số lượng"
                  required
                />
              </div>

              {/* Màu sắc */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Màu sắc</label>
                <input
                  type="text"
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Nhập màu sắc"
                />
              </div>

              {/* CPU */}
              <div className="col-md-6">
                <label className="form-label fw-bold">CPU</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  placeholder="Nhập CPU (ví dụ: A14 Bionic)"
                />
              </div>

              {/* Bộ nhớ */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Bộ nhớ</label>
                <input
                  type="text"
                  className="form-control"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  placeholder="Nhập bộ nhớ (ví dụ: 128GB)"
                />
              </div>

              {/* Hệ điều hành */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Hệ điều hành</label>
                <input
                  type="text"
                  className="form-control"
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  placeholder="Nhập hệ điều hành (ví dụ: iOS 16)"
                />
              </div>

              {/* Pin */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Pin</label>
                <input
                  type="text"
                  className="form-control"
                  name="battery"
                  value={formData.battery}
                  onChange={handleChange}
                  placeholder="Nhập dung lượng pin (ví dụ: 4000mAh)"
                />
              </div>

              {/* Kích thước màn hình */}
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Kích thước màn hình
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="screenSize"
                  value={formData.screenSize}
                  onChange={handleChange}
                  placeholder="Nhập kích thước (ví dụ: 6.1 inch)"
                />
              </div>

              {/* Camera */}
              <div className="col-md-6">
                <label className="form-label fw-bold">Camera</label>
                <input
                  type="text"
                  className="form-control"
                  name="camera"
                  value={formData.camera}
                  onChange={handleChange}
                  placeholder="Nhập thông số camera (ví dụ: 12MP)"
                />
              </div>

              {/* Mô tả */}
              <div className="col-12">
                <label className="form-label fw-bold">Mô tả</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              {/* Ảnh sản phẩm */}
              <div className="col-12">
                <label className="form-label fw-bold">Ảnh sản phẩm</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formData.image && (
                  <div className="mt-3 text-center">
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="submit"
                className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              >
                <i className="bi bi-check-circle-fill"></i> Cập nhật hàng hóa
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

export default EditProducts;
