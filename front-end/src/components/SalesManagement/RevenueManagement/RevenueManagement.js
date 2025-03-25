import React, { useState, useEffect } from "react";
import SalesService from "../../../services/Sales.service";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Pagination } from "antd";

const RevenueManagement = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedSales, setSelectedSales] = useState([]);
  const [showCustomRangeModal, setShowCustomRangeModal] = useState(false);
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [customRevenue, setCustomRevenue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Lấy dữ liệu giao dịch từ API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await SalesService.getAllSales();
        console.log("Dữ liệu từ json-server:", response);
        if (Array.isArray(response)) {
          setSales(response);
        } else {
          console.error("Dữ liệu không phải mảng:", response);
          setSales([]);
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

  // Xử lý chọn/tỏa chọn giao dịch
  const handleSelectSale = (id) => {
    setSelectedSales((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Xử lý chọn/tỏa chọn tất cả giao dịch trên trang hiện tại
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const currentPageIds = currentSales.map((sale) => sale.id);
      setSelectedSales((prev) => [...new Set([...prev, ...currentPageIds])]);
    } else {
      const currentPageIds = currentSales.map((sale) => sale.id);
      setSelectedSales((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  // Xử lý quay lại trang quản lý bán hàng
  const handleBackToSales = () => {
    navigate("/admin/sales-management");
  };

  // Xử lý điều hướng đến trang sửa
  const handleEditClick = (saleId) => {
    navigate(`/admin/edit-sale/${saleId}`);
  };

  // Xử lý mở modal xóa đơn
  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  // Xử lý xác nhận xóa đơn
  const handleConfirmDelete = async () => {
    if (!selectedSale) return;
    try {
      await SalesService.deleteSale(selectedSale.id);
      setSales((prev) => prev.filter((sale) => sale.id !== selectedSale.id));
      setSelectedSales((prev) => prev.filter((sid) => sid !== selectedSale.id));
      toast.success("Xóa giao dịch thành công!");
      if (sales.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
      setShowDeleteModal(false);
      setSelectedSale(null);
    } catch (err) {
      toast.error(`Có lỗi khi xóa giao dịch: ${err.message}`);
      console.error("Lỗi xóa:", err);
    }
  };

  // Xử lý xóa nhiều giao dịch
  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedSales.map((id) => SalesService.deleteSale(id)));
      setSales((prev) =>
        prev.filter((sale) => !selectedSales.includes(sale.id))
      );
      setSelectedSales([]);
      toast.success(`Xóa ${selectedSales.length} giao dịch thành công!`);
      if (sales.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error(`Có lỗi khi xóa giao dịch: ${err.message}`);
    } finally {
      setShowBulkDeleteModal(false);
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

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedSales([]);
  };

  // Tính toán danh sách giao dịch trên trang hiện tại
  const indexOfLastSale = currentPage * pageSize;
  const indexOfFirstSale = indexOfLastSale - pageSize;
  const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);

  // Kiểm tra xem tất cả giao dịch trên trang hiện tại đã được chọn chưa
  const allSelectedOnPage =
    currentSales.length > 0 &&
    currentSales.every((sale) => selectedSales.includes(sale.id));

  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách doanh thu...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Quản lý doanh thu
          </h4>
          <h5 className="fw-bold mb-3">Danh sách giao dịch</h5>
          {sales.length === 0 ? (
            <p className="text-center">Không có giao dịch nào để hiển thị.</p>
          ) : (
            <>
              {selectedSales.length > 0 && (
                <button
                  className="btn btn-danger fw-bold px-4 py-2 mb-3 d-flex align-items-center gap-2"
                  onClick={() => setShowBulkDeleteModal(true)}
                >
                  <i className="bi bi-trash-fill"></i> Xóa{" "}
                  {selectedSales.length} giao dịch
                </button>
              )}
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={allSelectedOnPage}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="fw-bold">Họ và tên</th>
                      <th className="fw-bold">Số điện thoại</th>
                      <th className="fw-bold">Sản phẩm</th>
                      <th className="fw-bold">Giá</th>
                      <th className="fw-bold text-center">Số lượng</th>
                      <th className="fw-bold">Tổng tiền</th>
                      <th className="fw-bold">Ngày giao dịch</th>
                      <th className="fw-bold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedSales.includes(sale.id)}
                            onChange={() => handleSelectSale(sale.id)}
                          />
                        </td>
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
                                  (p) =>
                                    `${p.price.toLocaleString("vi-VN")} VNĐ`
                                )
                                .join(", ")
                            : "N/A"}
                        </td>
                        <td className="text-center">
                          {sale.products && Array.isArray(sale.products)
                            ? sale.products.map((p) => p.quantity).join(", ")
                            : "N/A"}
                        </td>
                        <td>{sale.totalAmount.toLocaleString("vi-VN")} VNĐ</td>
                        <td>{new Date(sale.date).toLocaleString("vi-VN")}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm shadow-sm me-2"
                            onClick={() => handleEditClick(sale.id)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm shadow-sm"
                            onClick={() => handleDeleteClick(sale)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
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
                  total={sales.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-secondary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handleBackToSales}
            >
              <i className="bi bi-arrow-left-circle-fill"></i> Quay lại Quản lý
              bán hàng
            </button>
          </div>
        </div>
      </div>

      {/* Card thống kê doanh thu */}
      <div className="card shadow-lg rounded-3 border-0 mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-4">Thống kê doanh thu</h5>
          <div className="row g-4">
            <div className="col-md-3">
              <div
                className="p-3 rounded-3 shadow-sm text-white d-flex flex-column justify-content-between"
                style={{
                  background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "120px", // Chiều cao cố định
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-sun-fill fs-4"></i>
                  <h6 className="mb-0">Doanh thu hôm nay</h6>
                </div>
                <p className="fw-bold fs-4 mb-0">
                  {revenueStats.dailyRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded-3 shadow-sm text-white d-flex flex-column justify-content-between"
                style={{
                  background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "120px", // Chiều cao cố định
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-month-fill fs-4"></i>
                  <h6 className="mb-0">Doanh thu tháng này</h6>
                </div>
                <p className="fw-bold fs-4 mb-0">
                  {revenueStats.monthlyRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded-3 shadow-sm text-white d-flex flex-column justify-content-between"
                style={{
                  background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "120px", // Chiều cao cố định
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-fill fs-4"></i>
                  <h6 className="mb-0">Doanh thu năm nay</h6>
                </div>
                <p className="fw-bold fs-4 mb-0">
                  {revenueStats.yearlyRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div
                className="p-3 rounded-3 shadow-sm text-white d-flex flex-column justify-content-between cursor-pointer position-relative"
                style={{
                  background: "linear-gradient(135deg, #f6d365, #fda085)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  height: "120px", // Chiều cao cố định
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => setShowCustomRangeModal(true)}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-clock-fill fs-4"></i>
                  <h6 className="mb-0">Doanh thu tùy chỉnh</h6>
                </div>
                <p className="fw-bold fs-4 mb-0">
                  {customRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <i
                  className="bi bi-info-circle-fill position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                    fontSize: "1rem",
                    opacity: 0.75,
                  }}
                  title="Nhấn để chọn khoảng thời gian"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa đơn */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
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

      {/* Modal xác nhận xóa nhiều */}
      <Modal
        show={showBulkDeleteModal}
        onHide={() => setShowBulkDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhiều giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa {selectedSales.length} giao dịch đã chọn
          không? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBulkDeleteModal(false)}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleBulkDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chọn khoảng thời gian tùy chỉnh */}
      <Modal
        show={showCustomRangeModal}
        onHide={() => setShowCustomRangeModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn khoảng thời gian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Từ ngày</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={customRange.startDate}
                onChange={handleCustomRangeChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Đến ngày</Form.Label>
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
