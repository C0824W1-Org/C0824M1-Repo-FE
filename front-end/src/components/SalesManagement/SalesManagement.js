import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import CustomersService from "../../services/Customers.service";
import ProductsService from "../../services/Products.service";
import SalesService from "../../services/Sales.service";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const SalesManagement = () => {
  const navigate = useNavigate();
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
  };

  // Xử lý tìm kiếm sản phẩm
  const handleProductSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Lọc khách hàng
  const filteredCustomers = customers.filter((c) =>
    searchCustomer.type === "fullName"
      ? c.fullName.toLowerCase().includes(searchCustomer.value.toLowerCase())
      : c.phone.includes(searchCustomer.value)
  );

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) =>
    searchProduct.type === "name"
      ? p.name.toLowerCase().includes(searchProduct.value.toLowerCase())
      : p.brand.toLowerCase().includes(searchProduct.value.toLowerCase())
  );

  // Chọn khách hàng cũ
  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
    setCustomer({ ...customer });
    setShowCustomerModal(false);
  };

  // Thêm sản phẩm vào danh sách đã chọn
  const handleSelectProduct = (product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts((prev) => [...prev, { ...product }]);
    }
    setShowProductModal(false);
  };

  // Thay đổi số lượng sản phẩm
  const handleQuantityChange = (productId, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
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

      // Tạo PDF
      const doc = new jsPDF();
      doc.text("HÓA ĐƠN THANH TOÁN", 20, 20);
      doc.text(`Khách hàng: ${customer.fullName}`, 20, 30);
      doc.text(`Số điện thoại: ${customer.phone}`, 20, 40);
      doc.text(`Địa chỉ: ${customer.address}`, 20, 50);
      doc.text(`Tuổi: ${customer.age}`, 20, 60);
      doc.text(`Email: ${customer.email || "-"}`, 20, 70);
      doc.text("Sản phẩm:", 20, 80);
      selectedProducts.forEach((p, index) => {
        doc.text(
          `${index + 1}. ${p.name} - Giá: ${p.price.toLocaleString(
            "vi-VN"
          )} VNĐ - Số lượng: ${p.selectedQuantity}`,
          20,
          90 + index * 10
        );
      });
      doc.text(
        `Tổng tiền: ${totalAmount.toLocaleString("vi-VN")} VNĐ`,
        20,
        90 + selectedProducts.length * 10 + 10
      );
      doc.text(
        `Hình thức thanh toán: ${
          paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"
        }`,
        20,
        90 + selectedProducts.length * 10 + 20
      );
      doc.save(`HoaDon_${customer.fullName}_${Date.now()}.pdf`);

      toast.success("Thanh toán thành công!");
      // Điều hướng đến trang doanh thu sau khi thanh toán thành công
      navigate("/admin/revenue-management");
    } catch (err) {
      console.error("Lỗi trong handlePayment:", err.response || err.message);
      toast.error(err.message || "Có lỗi khi xử lý thanh toán.");
    }
  };

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Quản lý bán hàng</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Thông tin bán hàng</h5>
          <div className="mb-3">
            <h6>Thông tin khách hàng</h6>
            <Button
              variant="primary"
              onClick={() => setShowCustomerModal(true)}
              className="mb-2"
            >
              Chọn khách hàng cũ
            </Button>
            <div className="row">
              <div className="col-md-4">
                <label>Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  required
                />
              </div>
              <div className="col-md-4 mt-2">
                <label>Tuổi</label>
                <input
                  type="number"
                  className="form-control"
                  name="age"
                  value={customer.age}
                  onChange={handleCustomerChange}
                  required
                />
              </div>
              <div className="col-md-4 mt-2">
                <label>Email (không bắt buộc)</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                />
              </div>
            </div>
          </div>
          <Modal
            show={showCustomerModal}
            onHide={() => setShowCustomerModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Chọn khách hàng cũ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-2 mb-3">
                <select
                  className="form-control"
                  name="type"
                  value={searchCustomer.type}
                  onChange={handleCustomerSearchChange}
                >
                  <option value="fullName">Tên</option>
                  <option value="phone">Số điện thoại</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  name="value"
                  value={searchCustomer.value}
                  onChange={handleCustomerSearchChange}
                  placeholder="Tìm kiếm..."
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={
                        selectedCustomerId === c.id ? "table-active" : ""
                      }
                    >
                      <td>{c.fullName}</td>
                      <td>{c.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <div className="mb-3">
            <h6>Sản phẩm</h6>
            <Button
              variant="primary"
              onClick={() => setShowProductModal(true)}
              className="mb-2"
            >
              Chọn sản phẩm
            </Button>
            {selectedProducts.length > 0 && (
              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.price.toLocaleString("vi-VN")} VNĐ</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={p.selectedQuantity}
                          onChange={(e) =>
                            handleQuantityChange(p.id, e.target.value)
                          }
                          min="1"
                          max={p.quantity}
                        />
                      </td>
                      <td>
                        {(p.price * p.selectedQuantity).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveProduct(p.id)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <Modal
            show={showProductModal}
            onHide={() => setShowProductModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Chọn sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex gap-2 mb-3">
                <select
                  className="form-control"
                  name="type"
                  value={searchProduct.type}
                  onChange={handleProductSearchChange}
                >
                  <option value="name">Tên</option>
                  <option value="brand">Hãng</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  name="value"
                  value={searchProduct.value}
                  onChange={handleProductSearchChange}
                  placeholder="Tìm kiếm..."
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Hãng</th>
                    <th>Giá</th>
                    <th>Số lượng còn lại</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} onClick={() => handleSelectProduct(p)}>
                      <td>{p.name}</td>
                      <td>{p.brand}</td>
                      <td>{p.price.toLocaleString("vi-VN")} VNĐ</td>
                      <td>{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <div className="mb-3">
            <h6>Thành tiền: {totalAmount.toLocaleString("vi-VN")} VNĐ</h6>
          </div>
          <div className="mb-3">
            <h6>Hình thức thanh toán</h6>
            <div>
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <label htmlFor="cash" className="ms-2">
                Tiền mặt
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="transfer"
                name="paymentMethod"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
              />
              <label htmlFor="transfer" className="ms-2">
                Chuyển khoản
              </label>
              {paymentMethod === "transfer" && (
                <div className="mt-2">
                  <img
                    src="https://cdn.tgdd.vn/Products/Images/42/334864/iphone-16e-thumb-600x600.jpg"
                    alt="QR Code"
                    style={{ width: "150px" }}
                  />
                </div>
              )}
            </div>
          </div>
          <Button variant="success" onClick={handlePayment}>
            Tiến hành thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesManagement;
