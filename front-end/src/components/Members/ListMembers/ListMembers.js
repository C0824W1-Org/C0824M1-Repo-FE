import React, { useState, useEffect } from "react";
import UsersService from "../../../services/Users.service";
import { toast } from "react-toastify";

const ListMembers = ({ onPageChange }) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    phone: "",
    job: "",
  });

  // Lấy danh sách nhân viên khi component được mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await UsersService.getAllUsers();
        const staffMembers = response.filter(
          (user) => user.role !== "customer"
        );
        setMembers(staffMembers);
        setFilteredMembers(staffMembers); // Ban đầu hiển thị tất cả
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
  };

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

  // Xử lý xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await UsersService.deleteUser(id);
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );
        setFilteredMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
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
  };

  // Chuyển sang trang thêm nhân viên
  const handleAdd = () => {
    onPageChange("AddMembers");
  };

  // Chuyển sang trang sửa nhân viên
  const handleEdit = (id) => {
    onPageChange("EditMembers", { memberId: id });
  };

  if (loading) {
    return <div>Đang tải danh sách nhân viên...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="content container-fluid">
      <h2>Danh sách nhân viên</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Danh sách nhân viên</h5>
          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-primary" onClick={handleAdd}>
              Thêm nhân viên
            </button>
            <input
              type="text"
              className="form-control"
              name="fullName"
              placeholder="Tìm theo họ và tên"
              value={searchCriteria.fullName}
              onChange={handleSearchChange}
            />
            <input
              type="text"
              className="form-control"
              name="phone"
              placeholder="Tìm theo số điện thoại"
              value={searchCriteria.phone}
              onChange={handleSearchChange}
            />
            <select
              className="form-control"
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
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Chức vụ</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.personalInfo.fullName}</td>
                  <td>{member.personalInfo.job}</td>
                  <td>{member.personalInfo.dateOfBirth}</td>
                  <td>{member.personalInfo.address}</td>
                  <td>{member.personalInfo.phone}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(member.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(member.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListMembers;
