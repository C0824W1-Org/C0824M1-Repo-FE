import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import CustomersService from "../../services/Customers.service";
import ProductsService from "../../services/Products.service";
import SalesService from "../../services/Sales.service";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import qrCode from "../../pages/assets/img/qr_code.jpg";

// Định dạng tiền tệ
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

// Định dạng ngày giờ
const formatDateTime = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const SalesManagement = () => {
  const navigate = useNavigate();
  const pdfRef = useRef();
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    age: "",
    email: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState({
    type: "fullName",
    value: "",
  });
  const [searchProduct, setSearchProduct] = useState({
    type: "name",
    value: "",
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // State cho phân trang khách hàng
  const [currentPageCustomer, setCurrentPageCustomer] = useState(1);
  const customersPerPage = 6;

  // State cho phân trang sản phẩm
  const [currentPageProduct, setCurrentPageProduct] = useState(1);
  const productsPerPage = 6;

  // Load danh sách khách hàng và sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await CustomersService.getAllCustomers();
        const productsData = await ProductsService.getAllProducts();
        setCustomers(customersData);
        setProducts(productsData.map((p) => ({ ...p, selectedQuantity: 1 })));
      } catch (err) {
        toast.error("Có lỗi khi tải dữ liệu.");
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  // Tính tổng tiền
  useEffect(() => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.price * product.selectedQuantity,
      0
    );
    setTotalAmount(total);
  }, [selectedProducts]);

  // Xử lý thay đổi thông tin khách hàng
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý tìm kiếm khách hàng
  const handleCustomerSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCustomer((prev) => ({ ...prev, [name]: value }));
    setCurrentPageCustomer(1);
  };

  // Xử lý tìm kiếm sản phẩm
  const handleProductSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchProduct((prev) => ({ ...prev, [name]: value }));
    setCurrentPageProduct(1);
  };

  // Lọc khách hàng
  const filteredCustomers = customers.filter((c) =>
    searchCustomer.type === "fullName"
      ? c.fullName.toLowerCase().includes(searchCustomer.value.toLowerCase())
      : c.phone.includes(searchCustomer.value)
  );

  // Tính toán phân trang khách hàng
  const totalCustomers = filteredCustomers.length;
  const indexOfLastCustomer = currentPageCustomer * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Xử lý chuyển trang khách hàng
  const handlePageChangeCustomer = (page) => {
    setCurrentPageCustomer(page);
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) =>
    searchProduct.type === "name"
      ? p.name.toLowerCase().includes(searchProduct.value.toLowerCase())
      : p.brand.toLowerCase().includes(searchProduct.value.toLowerCase())
  );

  // Tính toán phân trang sản phẩm
  const totalProducts = filteredProducts.length;
  const indexOfLastProduct = currentPageProduct * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Xử lý chuyển trang sản phẩm
  const handlePageChangeProduct = (page) => {
    setCurrentPageProduct(page);
  };

  // Chọn khách hàng cũ
  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    setCustomer({ ...customer });
    setShowCustomerModal(false);
  };

  // Thêm sản phẩm vào danh sách đã chọn
  const handleSelectProduct = (product) => {
    if (product.quantity <= 0) {
      toast.error(`Sản phẩm ${product.name} đã hết hàng!`);
      return;
    }
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, { ...product }]);
    }
    setShowProductModal(false);
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (productId, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    const product = products.find((p) => p.id === productId);
    if (newQuantity > product.quantity) {
      toast.error(`Số lượng tồn kho của ${product.name} không đủ!`);
      return;
    }
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, selectedQuantity: newQuantity } : p
      )
    );
  };

  // Xóa sản phẩm khỏi danh sách đã chọn
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Tạo hóa đơn PDF và xử lý thanh toán
  const handlePayment = async () => {
    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.address ||
      !customer.age
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng (trừ email).");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    try {
      const saleData = {
        customer: { ...customer },
        products: selectedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.selectedQuantity,
        })),
        totalAmount,
        paymentMethod,
        date: new Date().toISOString(),
      };

      // Lưu giao dịch
      await SalesService.addSale(saleData);

      // Cập nhật số lượng sản phẩm
      for (const product of selectedProducts) {
        const currentProduct = products.find((p) => p.id === product.id);
        const newQuantity = currentProduct.quantity - product.selectedQuantity;
        if (newQuantity < 0) {
          throw new Error(
            `Số lượng tồn kho của ${currentProduct.name} không đủ.`
          );
        }
        await ProductsService.updateProductQuantity(product.id, newQuantity);
      }

      // Tạo PDF từ HTML
      const element = pdfRef.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`HoaDon_${customer.fullName}_${Date.now()}.pdf`);

      toast.success("Thanh toán thành công!");
      navigate("/admin/revenue-management");
    } catch (err) {
      console.error("Lỗi trong handlePayment:", err.response || err.message);
      toast.error(err.message || "Có lỗi khi xử lý thanh toán.");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Quản lý bán hàng
          </h4>

          {/* Thông tin khách hàng */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Thông tin khách hàng</h5>
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={() => setShowCustomerModal(true)}
              >
                <i className="bi bi-person-plus-fill"></i> Chọn khách hàng cũ
              </button>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Họ và tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Số điện thoại <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  Tuổi <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={customer.age}
                  onChange={handleCustomerChange}
                  placeholder="Nhập tuổi"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  placeholder="Nhập email (ví dụ: customer@domain.com)"
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">
                  Địa chỉ <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>
            </div>
          </div>

          {/* Modal chọn khách hàng */}
          <Modal
            show={showCustomerModal}
            onHide={() => setShowCustomerModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chọn khách hàng cũ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-3 mb-4">
                <div className="input-group w-auto shadow-sm">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <select
                    className="form-select"
                    name="type"
                    value={searchCustomer.type}
                    onChange={handleCustomerSearchChange}
                  >
                    <option value="fullName">Tên</option>
                    <option value="phone">Số điện thoại</option>
                  </select>
                </div>
                <div className="input-group w-auto shadow-sm">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="value"
                    value={searchCustomer.value}
                    onChange={handleCustomerSearchChange}
                    placeholder="Tìm kiếm..."
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle ">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold text-center">Họ và tên</th>
                      <th className="fw-bold text-center">Số điện thoại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={
                          selectedCustomerId === c.id ? "table-active" : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{c.fullName}</td>
                        <td className="text-center">{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  current={currentPageCustomer}
                  pageSize={customersPerPage}
                  total={totalCustomers}
                  onChange={handlePageChangeCustomer}
                  showSizeChanger={false}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowCustomerModal(false)}
              >
                Đóng
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  handleSelectCustomer(
                    filteredCustomers.find((c) => c.id === selectedCustomerId)
                  )
                }
                disabled={!selectedCustomerId}
              >
                Chọn
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Sản phẩm */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Sản phẩm</h5>
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={() => setShowProductModal(true)}
              >
                <i className="bi bi-cart-plus-fill"></i> Chọn sản phẩm
              </button>
            </div>
            {selectedProducts.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold">Tên sản phẩm</th>
                      <th className="fw-bold">Giá</th>
                      <th className="fw-bold">Số lượng</th>
                      <th className="fw-bold">Thành tiền</th>
                      <th className="fw-bold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{formatCurrency(p.price)}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={p.selectedQuantity}
                            onChange={(e) =>
                              handleQuantityChange(p.id, e.target.value)
                            }
                            min="1"
                            max={p.quantity}
                            style={{ width: "100px", margin: "0 auto" }}
                          />
                        </td>
                        <td>{formatCurrency(p.price * p.selectedQuantity)}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm shadow-sm"
                            onClick={() => handleRemoveProduct(p.id)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal chọn sản phẩm */}
          <Modal
            show={showProductModal}
            onHide={() => setShowProductModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-3 mb-4">
                <div className="input-group w-auto shadow-sm">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <select
                    className="form-select"
                    name="type"
                    value={searchProduct.type}
                    onChange={handleProductSearchChange}
                  >
                    <option value="name">Tên</option>
                    <option value="brand">Hãng</option>
                  </select>
                </div>
                <div className="input-group w-auto shadow-sm">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="value"
                    value={searchProduct.value}
                    onChange={handleProductSearchChange}
                    placeholder="Tìm kiếm..."
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-bold">Tên</th>
                      <th className="fw-bold">Hãng</th>
                      <th className="fw-bold">Giá</th>
                      <th className="fw-bold">Số lượng còn lại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{p.name}</td>
                        <td>{p.brand}</td>
                        <td>{formatCurrency(p.price)}</td>
                        <td>{p.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Pagination
                  current={currentPageProduct}
                  pageSize={productsPerPage}
                  total={totalProducts}
                  onChange={handlePageChangeProduct}
                  showSizeChanger={false}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowProductModal(false)}
              >
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Tổng tiền */}
          <div className="mb-4">
            <h5 className="fw-bold">
              Tổng tiền: {formatCurrency(totalAmount)}
            </h5>
          </div>

          {/* Hình thức thanh toán */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3">Hình thức thanh toán</h5>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="form-check-input"
                />
                <label htmlFor="cash" className="form-check-label">
                  Tiền mặt
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  id="transfer"
                  name="paymentMethod"
                  value="transfer"
                  checked={paymentMethod === "transfer"}
                  onChange={() => setPaymentMethod("transfer")}
                  className="form-check-input"
                />
                <label htmlFor="transfer" className="form-check-label">
                  Chuyển khoản
                </label>
              </div>
            </div>
            {paymentMethod === "transfer" && (
              <div className="mt-3 text-center">
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "150px", borderRadius: "8px" }}
                />
              </div>
            )}
          </div>

          {/* Nút thanh toán */}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handlePayment}
            >
              <i className="bi bi-credit-card-fill"></i> Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Phần HTML ẩn để tạo PDF */}
      <div style={{ position: "absolute", left: "-9999px" }} ref={pdfRef}>
        <div
          style={{
            width: "595px",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            HÓA ĐƠN THANH TOÁN
          </h1>
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            Ngày in: {formatDateTime(new Date())}
          </p>
          <hr style={{ border: "1px solid #000", margin: "10px 0" }} />
          <h2 style={{ fontSize: "14px", marginBottom: "10px" }}>
            THÔNG TIN KHÁCH HÀNG
          </h2>
          <p>Khách hàng: {customer.fullName}</p>
          <p>Số điện thoại: {customer.phone}</p>
          <p>Địa chỉ: {customer.address}</p>
          <p>Tuổi: {customer.age}</p>
          <p>Email: {customer.email || "-"}</p>
          <hr style={{ border: "1px solid #000", margin: "10px 0" }} />
          <h2 style={{ fontSize: "14px", marginBottom: "10px" }}>
            DANH SÁCH SẢN PHẨM
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  STT
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Tên sản phẩm
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Giá
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Số lượng
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "5px",
                    textAlign: "left",
                  }}
                >
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p, index) => (
                <tr key={p.id}>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {index + 1}.
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {p.name}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {formatCurrency(p.price)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {p.selectedQuantity}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px" }}>
                    {formatCurrency(p.price * p.selectedQuantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ border: "1px solid #000", margin: "10px 0" }} />
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            Tổng tiền: {formatCurrency(totalAmount)}
          </p>
          <p>
            Hình thức thanh toán:{" "}
            {paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
          </p>
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              marginTop: "20px",
            }}
          >
            Cảm ơn quý khách đã mua hàng!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
