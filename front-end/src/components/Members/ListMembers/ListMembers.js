import React, { useState, useEffect } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";

const ListMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    phone: "",
    job: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Hàm định dạng ngày thành "ngày/tháng/năm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Lấy danh sách nhân viên khi component được mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await UsersService.getAllUsers();
        const staffMembers = response.filter(
          (user) => user.role !== "customer"
        );
        setMembers(staffMembers);
        setFilteredMembers(staffMembers);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách nhân viên");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
    setSelectedMembers([]);
  };

  // Lọc danh sách nhân viên dựa trên searchCriteria
  useEffect(() => {
    const filtered = members.filter((member) => {
      const fullNameMatch = member.personalInfo.fullName
        .toLowerCase()
        .includes(searchCriteria.fullName.toLowerCase());
      const phoneMatch = member.personalInfo.phone.includes(
        searchCriteria.phone
      );
      const jobMatch = searchCriteria.job
        ? member.personalInfo.job === searchCriteria.job
        : true;
      return fullNameMatch && phoneMatch && jobMatch;
    });
    setFilteredMembers(filtered);
  }, [searchCriteria, members]);

  // Xử lý chọn/tỏa chọn nhân viên
  const handleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  // Xử lý chọn/tỏa chọn tất cả nhân viên trên trang hiện tại
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const currentPageIds = currentMembers.map((member) => member.id);
      setSelectedMembers((prev) => [...new Set([...prev, ...currentPageIds])]);
    } else {
      const currentPageIds = currentMembers.map((member) => member.id);
      setSelectedMembers((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  // Hiển thị modal xác nhận xóa đơn
  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setShowDeleteModal(true);
  };

  // Xử lý xóa một nhân viên
  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await UsersService.deleteUser(memberToDelete);
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberToDelete)
        );
        setFilteredMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberToDelete)
        );
        setSelectedMembers((prev) =>
          prev.filter((mid) => mid !== memberToDelete)
        );
        toast.success("Xóa nhân viên thành công!");
        if (filteredMembers.length <= (currentPage - 1) * pageSize + 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
      } catch (err) {
        console.error("Lỗi khi xóa nhân viên:", err.response || err.message);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Có lỗi xảy ra khi xóa nhân viên."
        );
      }
    }
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Xử lý xóa nhiều nhân viên
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedMembers.map((id) => UsersService.deleteUser(id))
      );
      setMembers((prevMembers) =>
        prevMembers.filter((member) => !selectedMembers.includes(member.id))
      );
      setFilteredMembers((prevMembers) =>
        prevMembers.filter((member) => !selectedMembers.includes(member.id))
      );
      setSelectedMembers([]);
      toast.success(`Xóa ${selectedMembers.length} nhân viên thành công!`);
      if (filteredMembers.length <= (currentPage - 1) * pageSize + 1) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      console.error("Lỗi khi xóa nhân viên:", err.response || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi xóa nhân viên."
      );
    } finally {
      setShowBulkDeleteModal(false);
    }
  };

  // Đóng modal xóa đơn
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Hiển thị modal xác nhận xóa nhiều
  const handleShowBulkDeleteModal = () => {
    if (selectedMembers.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Đóng modal xóa nhiều
  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  // Điều hướng đến trang thêm nhân viên
  const handleAdd = () => {
    navigate("/admin/add-members");
  };

  // Điều hướng đến trang sửa nhân viên
  const handleEdit = (id) => {
    navigate(`/admin/edit-members/${id}`);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedMembers([]);
  };

  // Tính toán danh sách nhân viên hiển thị trên trang hiện tại
  const indexOfLastMember = currentPage * pageSize;
  const indexOfFirstMember = indexOfLastMember - pageSize;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  // Kiểm tra xem tất cả nhân viên trên trang hiện tại đã được chọn chưa
  const allSelectedOnPage =
    currentMembers.length > 0 &&
    currentMembers.every((member) => selectedMembers.includes(member.id));

  // Hiển thị loading
  if (loading) {
    return (
      <div className="text-center py-5">Đang tải danh sách nhân viên...</div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-lg rounded-3 border-0">
        <div className="card-body">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Danh sách nhân viên
          </h4>
          <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <button
              className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center gap-2"
              onClick={handleAdd}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Thêm nhân viên
            </button>
            {selectedMembers.length > 0 && (
              <button
                className="btn btn-danger fw-bold px-4 py-2 d-flex align-items-center gap-2"
                onClick={handleShowBulkDeleteModal}
              >
                <i className="bi bi-trash-fill me-2"></i>Xóa{" "}
                {selectedMembers.length} nhân viên
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
            <div className="input-group w-auto shadow-sm">
              <span className="input-group-text">
                <i className="bi bi-pin"></i>
              </span>
              <select
                className="form-select"
                name="job"
                value={searchCriteria.job}
                onChange={handleSearchChange}
              >
                <option value="">Tất cả chức vụ</option>
                <option value="Quản trị">Quản trị</option>
                <option value="Thủ kho">Thủ kho</option>
                <option value="Bán hàng">Bán hàng</option>
                <option value="Kinh doanh">Kinh doanh</option>
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle text-center">
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
                  <th className="fw-bold">Chức vụ</th>
                  <th className="fw-bold">Ngày sinh</th>
                  <th className="fw-bold">Địa chỉ</th>
                  <th className="fw-bold">Số điện thoại</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleSelectMember(member.id)}
                      />
                    </td>
                    <td>{member.personalInfo.fullName}</td>
                    <td>{member.personalInfo.job}</td>
                    <td>{formatDate(member.personalInfo.dateOfBirth)}</td>
                    <td>{member.personalInfo.address}</td>
                    <td>{member.personalInfo.phone}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm me-2 shadow-sm"
                        onClick={() => handleEdit(member.id)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm shadow-sm"
                        onClick={() => handleDeleteClick(member.id)}
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
              total={filteredMembers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa đơn */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa nhân viên này không? Hành động này không thể
          hoàn tác.
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

      {/* Modal xác nhận xóa nhiều */}
      <Modal
        show={showBulkDeleteModal}
        onHide={handleCloseBulkDeleteModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa nhiều nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa {selectedMembers.length} nhân viên đã chọn
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

export default ListMembers;
