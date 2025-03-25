import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import SalesService from "../../../services/Sales.service";
import UsersService from "../../../services/Users.service";
import CustomersService from "../../../services/Customers.service";
import SuppliersService from "../../../services/Suppliers.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardContent = () => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.userLogin.role);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalSoldItems: 0,
    totalStaff: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu thống kê từ API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Lấy danh sách sản phẩm
        const productsResponse = await ProductsService.getAllProducts();
        const products = Array.isArray(productsResponse)
          ? productsResponse
          : [];
        const totalProducts = products.length;

        // Lấy danh sách giao dịch
        const salesResponse = await SalesService.getAllSales();
        const sales = Array.isArray(salesResponse) ? salesResponse : [];
        const totalRevenue = sales.reduce(
          (sum, sale) => sum + (sale.totalAmount || 0),
          0
        );
        const totalSoldItems = sales.reduce((sum, sale) => {
          return (
            sum +
            (sale.products || []).reduce(
              (subSum, p) => subSum + (p.quantity || 0),
              0
            )
          );
        }, 0);

        // Lấy danh sách nhân viên
        const usersResponse = await UsersService.getAllUsers();
        const users = Array.isArray(usersResponse) ? usersResponse : [];
        const totalStaff = users.filter(
          (user) => user.role !== "customer"
        ).length;

        // Lấy danh sách khách hàng
        const customersResponse = await CustomersService.getAllCustomers();
        const customers = Array.isArray(customersResponse)
          ? customersResponse
          : [];
        const totalCustomers = customers.length;

        // Lấy danh sách nhà cung cấp
        const suppliersResponse = await SuppliersService.getAllSuppliers();
        const suppliers = Array.isArray(suppliersResponse)
          ? suppliersResponse
          : [];
        const totalSuppliers = suppliers.length;

        setStats({
          totalProducts,
          totalRevenue,
          totalSoldItems,
          totalStaff,
          totalCustomers,
          totalSuppliers,
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

  // Điều hướng đến các trang liên quan với kiểm tra quyền
  const handleViewProducts = () => {
    if (["admin", "business", "stockkeeper"].includes(userRole)) {
      navigate("/admin/list-products");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  const handleViewSales = () => {
    if (["admin", "sales", "business"].includes(userRole)) {
      navigate("/admin/sales-management");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  const handleViewRevenue = () => {
    if (["admin", "business"].includes(userRole)) {
      navigate("/admin/revenue-management");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  const handleViewStaff = () => {
    if (userRole === "admin") {
      navigate("/admin/list-members");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  const handleViewCustomers = () => {
    if (userRole === "admin") {
      navigate("/admin/list-customers");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  const handleViewSuppliers = () => {
    if (["admin", "stockkeeper"].includes(userRole)) {
      navigate("/admin/list-suppliers");
    } else {
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  };

  if (loading) {
    return <div className="text-center py-5">Đang tải dữ liệu thống kê...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Trang chủ quản trị
          </h4>
          <div className="row g-4">
            {/* Tổng số sản phẩm */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-box-fill fs-4"></i>
                  <h5 className="mb-0">Tổng số sản phẩm</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">{stats.totalProducts}</p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewProducts}
                  disabled={
                    !["admin", "business", "stockkeeper"].includes(userRole)
                  }
                >
                  <i className="bi bi-list-ul"></i> Xem danh sách sản phẩm
                </button>
              </div>
            </div>

            {/* Tổng doanh thu */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-currency-dollar fs-4"></i>
                  <h5 className="mb-0">Tổng doanh thu</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">
                  {stats.totalRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewRevenue}
                  disabled={!["admin", "business"].includes(userRole)}
                >
                  <i className="bi bi-bar-chart-fill"></i> Xem chi tiết doanh
                  thu
                </button>
              </div>
            </div>

            {/* Số lượng sản phẩm đã bán */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-cart-check-fill fs-4"></i>
                  <h5 className="mb-0">Sản phẩm đã bán</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">{stats.totalSoldItems}</p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewSales}
                  disabled={!["admin", "sales", "business"].includes(userRole)}
                >
                  <i className="bi bi-cart-fill"></i> Xem quản lý bán hàng
                </button>
              </div>
            </div>

            {/* Tổng số nhân viên */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #f6d365, #fda085)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-people-fill fs-4"></i>
                  <h5 className="mb-0">Tổng số nhân viên</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">{stats.totalStaff}</p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewStaff}
                  disabled={userRole !== "admin"}
                >
                  <i className="bi bi-person-lines-fill"></i> Xem danh sách nhân
                  viên
                </button>
              </div>
            </div>

            {/* Tổng số khách hàng */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-person-heart fs-4"></i>
                  <h5 className="mb-0">Tổng số khách hàng</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">{stats.totalCustomers}</p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewCustomers}
                  disabled={userRole !== "admin"}
                >
                  <i className="bi bi-person-lines-fill"></i> Xem danh sách
                  khách hàng
                </button>
              </div>
            </div>

            {/* Tổng số nhà cung cấp */}
            <div className="col-md-4">
              <div
                className="p-4 rounded-3 shadow-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-truck fs-4"></i>
                  <h5 className="mb-0">Tổng số nhà cung cấp</h5>
                </div>
                <p className="fw-bold fs-3 mb-3">{stats.totalSuppliers}</p>
                <button
                  className="btn btn-light fw-bold px-4 py-2 d-flex align-items-center gap-2 mx-auto"
                  onClick={handleViewSuppliers}
                  disabled={!["admin", "stockkeeper"].includes(userRole)}
                >
                  <i className="bi bi-list-ul"></i> Xem danh sách nhà cung cấp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
