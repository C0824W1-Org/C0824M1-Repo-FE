import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../services/Customers.service";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { Pagination } from "antd";

const ListCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    phone: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomersService.getAllCustomers();
        if (Array.isArray(response)) {
          setCustomers(response);
          setFilteredCustomers(response);
        } else {
          console.error("Dữ liệu không phải mảng:", response);
          setCustomers([]);
          setFilteredCustomers([]);
          toast.error("Dữ liệu từ server không đúng định dạng.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách khách hàng");
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
    setSelectedCustomers([]);
  };

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const fullNameMatch = customer.fullName
        .toLowerCase()
        .includes(searchCriteria.fullName.toLowerCase());
      const phoneMatch = customer.phone.includes(searchCriteria.phone);
      return fullNameMatch && phoneMatch;
    });
    setFilteredCustomers(filtered);
  }, [searchCriteria, customers]);

  const handleSelectCustomer = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const currentPageIds = currentCustomers.map((customer) => customer.id);
      setSelectedCustomers((prev) => [
        ...new Set([...prev, ...currentPageIds]),
      ]);
    } else {
      const currentPageIds = currentCustomers.map((customer) => customer.id);
      setSelectedCustomers((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const handleDeleteClick = (id) => {
    setCustomerToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      try {
        await CustomersService.deleteCustomer(customerToDelete);
        setCustomers((prev) =>
          prev.filter((customer) => customer.id !== customerToDelete)
        );
        setFilteredCustomers((prev) =>
          prev.filter((customer) => customer.id !== customerToDelete)
        );
        setSelectedCustomers((prev) =>
          prev.filter((cid) => cid !== customerToDelete)
        );
        toast.success("Xóa khách hàng thành công!");
        if (filteredCustomers.length <= (currentPage - 1) * pageSize + 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
      } catch (err) {
        toast.error(`Có lỗi khi xóa khách hàng: ${err.message}`);
        console.error("Lỗi khi xóa khách hàng:", err);
      }
    }
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedCustomers.map((id) => CustomersService.deleteCustomer(id))
      );
      setCustomers((prev) =>
        prev.filter((customer) => !selectedCustomers.includes(customer.id))
      );
      setFilteredCustomers((prev) =>
        prev.filter((customer) => !selectedCustomers.includes(customer.id))
      );
      setSelectedCustomers([]);
      toast.success(`Xóa ${selectedCustomers.length} khách hàng thành công!`);
      if (filteredCustomers.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error(`Có lỗi khi xóa khách hàng: ${err.message}`);
    } finally {
      setShowBulkDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleShowBulkDeleteModal = () => {
    if (selectedCustomers.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  const handleAdd = () => {
    navigate("/admin/add-customers");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-customers/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedCustomers([]);
  };

  const indexOfLastCustomer = currentPage * pageSize;
  const indexOfFirstCustomer = indexOfLastCustomer - pageSize;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const allSelectedOnPage =
    currentCustomers.length > 0 &&
    currentCustomers.every((customer) =>
      selectedCustomers.includes(customer.id)
    );

  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách khách hàng...</div>
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
            Danh sách khách hàng
          </h4>
          <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <button
              className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handleAdd}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Thêm khách hàng
            </button>
            {selectedCustomers.length > 0 && (
              <button
                className="btn btn-danger fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={handleShowBulkDeleteModal}
              >
                <i className="bi bi-trash-fill me-2"></i>Xóa{" "}
                {selectedCustomers.length} khách hàng
              </button>
            )}
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="fullName"
                placeholder="Tìm theo họ và tên"
                value={searchCriteria.fullName}
                onChange={handleSearchChange}
              />
            </div>
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-telephone"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="phone"
                placeholder="Tìm theo số điện thoại"
                value={searchCriteria.phone}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold text-center">
                    <input
                      type="checkbox"
                      checked={allSelectedOnPage}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="fw-bold">Họ và tên</th>
                  <th className="fw-bold">Số điện thoại</th>
                  <th className="fw-bold">Địa chỉ</th>
                  <th className="fw-bold text-center">Tuổi</th>
                  <th className="fw-bold">Email</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                      />
                    </td>
                    <td>{customer.fullName}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td className="text-center">{customer.age}</td>
                    <td>{customer.email || "-"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm me-2 shadow-sm"
                        onClick={() => handleEdit(customer.id)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm shadow-sm"
                        onClick={() => handleDeleteClick(customer.id)}
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
              total={filteredCustomers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa khách hàng này không? Hành động này không
          thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xác nhận
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showBulkDeleteModal}
        onHide={handleCloseBulkDeleteModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhiều khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa {selectedCustomers.length} khách hàng đã
          chọn không? Hành động này không thể hoàn tác.
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

export default ListCustomers;
