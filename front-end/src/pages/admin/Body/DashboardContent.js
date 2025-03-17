import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import SalesService from "../../../services/Sales.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DashboardContent = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalSoldItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu thống kê từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Lấy danh sách sản phẩm
        const products = await ProductsService.getAllProducts();
        const totalProducts = products.length;

        // Lấy danh sách giao dịch
        const sales = await SalesService.getAllSales();
        const totalRevenue = sales.reduce(
          (sum, sale) => sum + sale.totalAmount,
          0
        );
        const totalSoldItems = sales.reduce((sum, sale) => {
          return (
            sum + sale.products.reduce((subSum, p) => subSum + p.quantity, 0)
          );
        }, 0);

        setStats({
          totalProducts,
          totalRevenue,
          totalSoldItems,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu thống kê");
        setLoading(false);
        toast.error("Không thể tải dữ liệu thống kê.");
      }
    };

    fetchDashboardData();
  }, []);

  // Điều hướng đến các trang liên quan
  const handleViewProducts = () => {
    navigate("/admin/list-products");
  };

  const handleViewSales = () => {
    navigate("/admin/sales-management");
  };

  const handleViewRevenue = () => {
    navigate("/admin/revenue-management");
  };

  if (loading) {
    return <div className="text-center py-5">Đang tải dữ liệu thống kê...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Trang chủ quản trị</h2>
      <div className="row g-4">
        {/* Tổng số sản phẩm */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Tổng số sản phẩm</h5>
              <p className="card-text display-4">{stats.totalProducts}</p>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={handleViewProducts}
              >
                Xem danh sách sản phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Tổng doanh thu</h5>
              <p className="card-text display-4">
                {stats.totalRevenue.toLocaleString("vi-VN")} VNĐ
              </p>
              <button
                className="btn btn-outline-success mt-3"
                onClick={handleViewRevenue}
              >
                Xem chi tiết doanh thu
              </button>
            </div>
          </div>
        </div>

        {/* Số lượng sản phẩm đã bán */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Sản phẩm đã bán</h5>
              <p className="card-text display-4">{stats.totalSoldItems}</p>
              <button
                className="btn btn-outline-info mt-3"
                onClick={handleViewSales}
              >
                Xem quản lý bán hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin chào mừng */}
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Chào mừng đến với Dashboard</h5>
          <p className="card-text">
            Đây là trung tâm quản trị của bạn. Từ đây, bạn có thể theo dõi sản
            phẩm, doanh thu, và các giao dịch bán hàng một cách dễ dàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
