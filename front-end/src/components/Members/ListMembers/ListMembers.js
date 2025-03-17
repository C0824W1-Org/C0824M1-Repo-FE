import React, { useState, useEffect } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

  // Hiển thị modal xác nhận xóa
  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setShowDeleteModal(true);
  };

  // Xử lý xóa nhân viên sau khi xác nhận
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
        toast.success("Xóa nhân viên thành công!");
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

  // Đóng modal mà không xóa
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Điều hướng đến trang thêm nhân viên
  const handleAdd = () => {
    navigate("/admin/add-members");
  };

  // Điều hướng đến trang sửa nhân viên
  const handleEdit = (id) => {
    navigate(`/admin/edit-members/${id}`);
  };

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
              className="btn btn-primary fw-bold px-4 py-2"
              onClick={handleAdd}
            >
              <i className="bi bi-person-plus-fill me-2"></i>Thêm nhân viên
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
                  <th className="fw-bold text-center">Họ và tên</th>
                  <th className="fw-bold text-center">Chức vụ</th>
                  <th className="fw-bold text-center">Ngày sinh</th>
                  <th className="fw-bold text-center">Địa chỉ</th>
                  <th className="fw-bold text-center">Số điện thoại</th>
                  <th className="fw-bold text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="text-center">
                      {member.personalInfo.fullName}
                    </td>
                    <td className="text-center">{member.personalInfo.job}</td>
                    <td className="text-center">
                      {member.personalInfo.dateOfBirth}
                    </td>
                    <td className="text-center">
                      {member.personalInfo.address}
                    </td>
                    <td className="text-center">{member.personalInfo.phone}</td>
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
        </div>
      </div>

      {/* Modal xác nhận xóa */}
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
    </div>
  );
};

export default ListMembers;
