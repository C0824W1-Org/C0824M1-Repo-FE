import React, { useState, useEffect } from "react";
import SalesService from "../../../services/Sales.service";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const RevenueManagement = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]); // Khởi tạo mặc định là mảng rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showCustomRangeModal, setShowCustomRangeModal] = useState(false);
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [customRevenue, setCustomRevenue] = useState(0);

  // Lấy dữ liệu giao dịch từ API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await SalesService.getAllSales();
        console.log("Dữ liệu từ json-server:", response); // Debug dữ liệu
        // Kiểm tra dữ liệu có phải mảng không
        if (Array.isArray(response)) {
          setSales(response);
        } else {
          console.error("Dữ liệu không phải mảng:", response);
          setSales([]); // Đặt lại thành mảng rỗng nếu không đúng
          toast.error("Dữ liệu từ server không đúng định dạng.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách doanh thu");
        setLoading(false);
        toast.error(err.message);
      }
    };
    fetchSales();
  }, []);

  // Tính doanh thu theo ngày, tháng, năm
  const calculateRevenueStats = () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const dailyRevenue = sales
      .filter((sale) => new Date(sale.date) >= startOfDay)
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    const monthlyRevenue = sales
      .filter((sale) => new Date(sale.date) >= startOfMonth)
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    const yearlyRevenue = sales
      .filter((sale) => new Date(sale.date) >= startOfYear)
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    return { dailyRevenue, monthlyRevenue, yearlyRevenue };
  };

  const revenueStats = calculateRevenueStats();

  // Xử lý quay lại trang quản lý bán hàng
  const handleBackToSales = () => {
    navigate("/admin/sales-management");
  };

  // Xử lý điều hướng đến trang sửa
  const handleEditClick = (saleId) => {
    navigate(`/admin/edit-sale/${saleId}`);
  };

  // Xử lý mở modal xóa
  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!selectedSale) return;
    try {
      await SalesService.deleteSale(selectedSale.id);
      setSales((prev) => prev.filter((sale) => sale.id !== selectedSale.id));
      toast.success("Xóa giao dịch thành công!");
      setShowDeleteModal(false);
      setSelectedSale(null);
    } catch (err) {
      toast.error(`Có lỗi khi xóa giao dịch: ${err.message}`);
      console.error("Lỗi xóa:", err);
    }
  };

  // Xử lý thay đổi khoảng thời gian tùy chỉnh
  const handleCustomRangeChange = (e) => {
    const { name, value } = e.target;
    setCustomRange((prev) => ({ ...prev, [name]: value }));
  };

  // Tính doanh thu theo khoảng thời gian tùy chỉnh
  const calculateCustomRevenue = () => {
    const { startDate, endDate } = customRange;
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    const revenue = sales
      .filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= start && saleDate <= end;
      })
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    setCustomRevenue(revenue);
    setShowCustomRangeModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách doanh thu...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Quản lý doanh thu</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Danh sách giao dịch</h5>
          {sales.length === 0 ? (
            <p className="text-center">Không có giao dịch nào để hiển thị.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  <th>Ngày giao dịch</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.customer.fullName}</td>
                    <td>{sale.customer.phone}</td>
                    <td>
                      {sale.products && Array.isArray(sale.products)
                        ? sale.products.map((p) => p.name).join(", ")
                        : "Không có sản phẩm"}
                    </td>
                    <td>
                      {sale.products && Array.isArray(sale.products)
                        ? sale.products
                            .map(
                              (p) => `${p.price.toLocaleString("vi-VN")} VNĐ`
                            )
                            .join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      {sale.products && Array.isArray(sale.products)
                        ? sale.products.map((p) => p.quantity).join(", ")
                        : "N/A"}
                    </td>
                    <td>{sale.totalAmount.toLocaleString("vi-VN")} VNĐ</td>
                    <td>{new Date(sale.date).toLocaleString("vi-VN")}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditClick(sale.id)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(sale)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Button
            variant="secondary"
            className="mt-3"
            onClick={handleBackToSales}
          >
            Quay lại Quản lý bán hàng
          </Button>
        </div>
      </div>

      {/* Card thống kê doanh thu */}
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Thống kê doanh thu</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <div className="p-3 bg-light rounded">
                <h6>Doanh thu hôm nay</h6>
                <p className="fw-bold fs-5">
                  {revenueStats.dailyRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-light rounded">
                <h6>Doanh thu tháng này</h6>
                <p className="fw-bold fs-5">
                  {revenueStats.monthlyRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3 bg-light rounded">
                <h6>Doanh thu năm nay</h6>
                <p className="fw-bold fs-5">
                  {revenueStats.yearlyRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 bg-light rounded cursor-pointer"
                onClick={() => setShowCustomRangeModal(true)}
              >
                <h6>Doanh thu tùy chỉnh</h6>
                <p className="fw-bold fs-5">
                  {customRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
                <small className="text-muted">
                  Nhấn để chọn khoảng thời gian
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể
          hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chọn khoảng thời gian tùy chỉnh */}
      <Modal
        show={showCustomRangeModal}
        onHide={() => setShowCustomRangeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn khoảng thời gian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Từ ngày</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={customRange.startDate}
                onChange={handleCustomRangeChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đến ngày</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={customRange.endDate}
                onChange={handleCustomRangeChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCustomRangeModal(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={calculateCustomRevenue}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RevenueManagement;
