import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

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
  const [productToDelete, setProductToDelete] = useState(null); // Xóa đơn
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false); // Xóa nhiều
  const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm được chọn
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

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
    setCurrentPage(1);
    setSelectedProducts([]); // Reset danh sách chọn khi tìm kiếm
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

  // Xử lý chọn/tỏa chọn sản phẩm
  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  // Xử lý chọn/tỏa chọn tất cả sản phẩm trên trang hiện tại
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const currentPageIds = currentProducts.map((product) => product.id);
      setSelectedProducts((prev) => [
        ...new Set([...prev, ...currentPageIds]), // Loại bỏ trùng lặp
      ]);
    } else {
      const currentPageIds = currentProducts.map((product) => product.id);
      setSelectedProducts((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  // Xử lý xóa một sản phẩm
  const handleDelete = async (id) => {
    try {
      await ProductsService.deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setSelectedProducts((prev) => prev.filter((pid) => pid !== id));
      toast.success("Xóa hàng hóa thành công!");
      if (filteredProducts.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      console.error("Lỗi khi xóa hàng hóa:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi xóa hàng hóa."
      );
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Xử lý xóa nhiều sản phẩm
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) => ProductsService.deleteProduct(id))
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => !selectedProducts.includes(product.id))
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
      toast.success(`Xóa ${selectedProducts.length} hàng hóa thành công!`);
      if (filteredProducts.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      console.error("Lỗi khi xóa hàng hóa:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi xóa hàng hóa."
      );
    } finally {
      setShowBulkDeleteModal(false);
    }
  };

  const handleAdd = () => {
    navigate("/admin/add-products");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-products/${id}`);
  };

  // Hiển thị modal xác nhận xóa
  const handleShowDeleteModal = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  // Đóng modal xóa
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Hiển thị modal xác nhận xóa nhiều
  const handleShowBulkDeleteModal = () => {
    if (selectedProducts.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Đóng modal xóa nhiều
  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProducts([]); // Reset danh sách chọn khi đổi trang
  };

  // Tính toán danh sách sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Kiểm tra xem tất cả sản phẩm trên trang hiện tại đã được chọn chưa
  const allSelectedOnPage =
    currentProducts.length > 0 &&
    currentProducts.every((product) => selectedProducts.includes(product.id));

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
            {selectedProducts.length > 0 && (
              <button
                className="btn btn-danger fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={handleShowBulkDeleteModal}
              >
                <FaTrash /> Xóa {selectedProducts.length} sản phẩm
              </button>
            )}
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
            <table className="table table-hover table-bordered align-middle ">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold text-center">
                    <input
                      type="checkbox"
                      checked={allSelectedOnPage}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="fw-bold">Ảnh</th>
                  <th className="fw-bold">Tên</th>
                  <th className="fw-bold">Hãng</th>
                  <th className="fw-bold">CPU</th>
                  <th className="fw-bold">Số lượng</th>
                  <th className="fw-bold">Hệ điều hành</th>
                  <th className="fw-bold text-center">Giá</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="align-middle">
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
                    <td className="align-middle">{product.name}</td>
                    <td className="align-middle">{product.brand}</td>
                    <td className="align-middle">{product.cpu}</td>
                    <td className="align-middle">{product.quantity}</td>
                    <td className="align-middle">{product.os}</td>
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
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa đơn */}
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

      {/* Modal xác nhận xóa nhiều */}
      <Modal
        show={showBulkDeleteModal}
        onHide={handleCloseBulkDeleteModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhiều sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa {selectedProducts.length} sản phẩm đã chọn
          không? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleBulkDelete}>
            Xóa
          </Button>
          <Button variant="secondary" onClick={handleCloseBulkDeleteModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListProducts;
