import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../services/Customers.service";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";

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
        toast.success("Xóa khách hàng thành công!");
      } catch (err) {
        toast.error(`Có lỗi khi xóa khách hàng: ${err.message}`);
        console.error("Lỗi khi xóa khách hàng:", err);
      }
    }
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const handleAdd = () => {
    navigate("/admin/add-customers");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-customers/${id}`);
  };

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
              className="btn btn-primary fw-bold px-4 py-2"
              onClick={handleAdd}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Thêm khách hàng
            </button>
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
            <table className="table table-hover table-bordered align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold text-center">Họ và tên</th>
                  <th className="fw-bold text-center">Số điện thoại</th>
                  <th className="fw-bold text-center">Địa chỉ</th>
                  <th className="fw-bold text-center">Tuổi</th>
                  <th className="fw-bold text-center">Email</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="text-center">{customer.fullName}</td>
                    <td className="text-center">{customer.phone}</td>
                    <td className="text-center">{customer.address}</td>
                    <td className="text-center">{customer.age}</td>
                    <td className="text-center">{customer.email || "-"}</td>
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
        </div>
      </div>

      {/* Modal xác nhận xóa */}
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
    </div>
  );
};

export default ListCustomers;
