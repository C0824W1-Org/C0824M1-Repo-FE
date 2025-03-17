import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    brand: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductsService.getAllProducts();
        const productsWithBrand = response.map((product) => ({
          ...product,
          brand: product.name.includes("iPhone")
            ? "Apple"
            : product.brand || "Samsung",
        }));
        setProducts(productsWithBrand);
        setFilteredProducts(productsWithBrand);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách hàng hóa");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Lọc sản phẩm dựa trên tiêu chí tìm kiếm
  useEffect(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchCriteria.name.toLowerCase());
      const brandMatch = searchCriteria.brand
        ? product.brand === searchCriteria.brand
        : true;
      return nameMatch && brandMatch;
    });
    setFilteredProducts(filtered);
  }, [searchCriteria, products]);

  // Xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      await ProductsService.deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      toast.success("Xóa hàng hóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa hàng hóa:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi xóa hàng hóa."
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  // Điều hướng đến trang thêm sản phẩm
  const handleAdd = () => {
    navigate("/admin/add-products");
  };

  // Điều hướng đến trang chỉnh sửa sản phẩm
  const handleEdit = (id) => {
    navigate(`/admin/edit-products/${id}`);
  };

  // Hiển thị modal xác nhận xóa
  const handleShowDeleteModal = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  // Đóng modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách hàng hóa...</div>
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
            Danh sách hàng hóa
          </h4>
          <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <button
              className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handleAdd}
            >
              <FaPlus /> Thêm hàng hóa
            </button>
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Tìm theo tên"
                value={searchCriteria.name}
                onChange={handleSearchChange}
              />
            </div>
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-tag"></i>
              </span>
              <select
                className="form-select"
                name="brand"
                value={searchCriteria.brand}
                onChange={handleSearchChange}
              >
                <option value="">Tất cả hãng</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Oppo">Oppo</option>
                <option value="Nokia">Nokia</option>
                <option value="Pixel">Pixel</option>
                <option value="Vivo">Vivo</option>
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold text-center">Ảnh</th>
                  <th className="fw-bold text-center">Tên</th>
                  <th className="fw-bold text-center">Hãng</th>
                  <th className="fw-bold text-center">CPU</th>
                  <th className="fw-bold text-center">Số lượng</th>
                  <th className="fw-bold text-center">Hệ điều hành</th>
                  <th className="fw-bold text-center">Giá</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="text-center align-middle">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ maxWidth: "50px", maxHeight: "50px" }}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="text-center align-middle">{product.name}</td>
                    <td className="text-center align-middle">
                      {product.brand}
                    </td>
                    <td className="text-center align-middle">{product.cpu}</td>
                    <td className="text-center align-middle">
                      {product.quantity}
                    </td>
                    <td className="text-center align-middle">{product.os}</td>
                    <td className="text-center align-middle">
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="text-center align-middle">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm d-flex align-items-center gap-1 shadow-sm"
                          onClick={() => handleEdit(product.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
                          onClick={() => handleShowDeleteModal(product.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể
          hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDelete(productToDelete)}
          >
            Xóa
          </Button>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListProducts;
