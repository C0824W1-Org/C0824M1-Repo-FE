import React, { useState, useEffect } from "react";
import SuppliersService from "../../../services/Suppliers.service";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const ListSuppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await SuppliersService.getAllSuppliers();
        setSuppliers(response);
        setFilteredSuppliers(response);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách nhà cung cấp");
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
    setSelectedSuppliers([]);
  };

  useEffect(() => {
    const filtered = suppliers.filter((supplier) => {
      const nameMatch = supplier.name
        .toLowerCase()
        .includes(searchCriteria.name.toLowerCase());
      const phoneMatch = supplier.phone.includes(searchCriteria.phone);
      const emailMatch = supplier.email
        .toLowerCase()
        .includes(searchCriteria.email.toLowerCase());
      return nameMatch && phoneMatch && emailMatch;
    });
    setFilteredSuppliers(filtered);
  }, [searchCriteria, suppliers]);

  const handleSelectSupplier = (id) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const currentPageIds = currentSuppliers.map((supplier) => supplier.id);
      setSelectedSuppliers((prev) => [
        ...new Set([...prev, ...currentPageIds]),
      ]);
    } else {
      const currentPageIds = currentSuppliers.map((supplier) => supplier.id);
      setSelectedSuppliers((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await SuppliersService.deleteSupplier(id);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== id)
      );
      setFilteredSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier.id !== id)
      );
      setSelectedSuppliers((prev) => prev.filter((sid) => sid !== id));
      toast.success("Xóa nhà cung cấp thành công!");
      if (filteredSuppliers.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa nhà cung cấp.");
    } finally {
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedSuppliers.map((id) => SuppliersService.deleteSupplier(id))
      );
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter(
          (supplier) => !selectedSuppliers.includes(supplier.id)
        )
      );
      setFilteredSuppliers((prevSuppliers) =>
        prevSuppliers.filter(
          (supplier) => !selectedSuppliers.includes(supplier.id)
        )
      );
      setSelectedSuppliers([]);
      toast.success(`Xóa ${selectedSuppliers.length} nhà cung cấp thành công!`);
      if (filteredSuppliers.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa nhà cung cấp.");
    } finally {
      setShowBulkDeleteModal(false);
    }
  };

  const handleAdd = () => {
    navigate("/admin/add-suppliers");
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-suppliers/${id}`);
  };

  const handleShowDeleteModal = (id) => {
    setSupplierToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const handleShowBulkDeleteModal = () => {
    if (selectedSuppliers.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedSuppliers([]);
  };

  const indexOfLastSupplier = currentPage * pageSize;
  const indexOfFirstSupplier = indexOfLastSupplier - pageSize;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );

  const allSelectedOnPage =
    currentSuppliers.length > 0 &&
    currentSuppliers.every((supplier) =>
      selectedSuppliers.includes(supplier.id)
    );

  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách nhà cung cấp...</div>
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
            Danh sách nhà cung cấp
          </h4>
          <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <button
              className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handleAdd}
            >
              <FaPlus /> Thêm nhà cung cấp
            </button>
            {selectedSuppliers.length > 0 && (
              <button
                className="btn btn-danger fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={handleShowBulkDeleteModal}
              >
                <FaTrash /> Xóa {selectedSuppliers.length} nhà cung cấp
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
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Tìm theo email"
                value={searchCriteria.email}
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
                  <th className="fw-bold">Mã nhà cung cấp</th>
                  <th className="fw-bold">Tên</th>
                  <th className="fw-bold">Địa chỉ</th>
                  <th className="fw-bold">Số điện thoại</th>
                  <th className="fw-bold">Email</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => handleSelectSupplier(supplier.id)}
                      />
                    </td>
                    <td className="align-middle">{supplier.supplierCode}</td>
                    <td className="align-middle">{supplier.name}</td>
                    <td className="align-middle">{supplier.address}</td>
                    <td className="align-middle">{supplier.phone}</td>
                    <td className="align-middle">{supplier.email}</td>
                    <td className="text-center align-middle">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-warning btn-sm d-flex align-items-center gap-1 shadow-sm"
                          onClick={() => handleEdit(supplier.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
                          onClick={() => handleShowDeleteModal(supplier.id)}
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
              total={filteredSuppliers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa nhà cung cấp này không? Hành động này không
          thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => handleDelete(supplierToDelete)}
          >
            Xóa
          </Button>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
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
          <Modal.Title>Xác nhận xóa nhiều nhà cung cấp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa {selectedSuppliers.length} nhà cung cấp đã
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

export default ListSuppliers;
