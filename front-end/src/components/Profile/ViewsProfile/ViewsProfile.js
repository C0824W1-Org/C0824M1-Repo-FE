import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewsProfile = () => {
  const navigate = useNavigate();
  const { userLogin } = useSelector((state) => state.auth);

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-5 text-danger fw-bold">
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const { personalInfo } = userLogin;

  const handleEditClick = () => {
    navigate("/admin/edit-profile");
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
        <div className="card-body p-4">
          <h4 className="card-title text-center text-primary fw-bold mb-4">
            Thông tin cá nhân
          </h4>
          <div className="d-flex flex-column align-items-center mb-4">
            {personalInfo.avatar ? (
              <img
                src={personalInfo.avatar}
                alt="User Avatar"
                className="rounded-circle border border-3 border-primary shadow-sm"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-light text-secondary"
                style={{ width: "150px", height: "150px", fontSize: "1.2rem" }}
              >
                Chưa có ảnh
              </div>
            )}
          </div>
          <table className="table table-hover table-bordered rounded-3 overflow-hidden">
            <tbody>
              <tr>
                <th
                  className="bg-light text-secondary"
                  scope="row"
                  style={{ width: "25%" }}
                >
                  Họ và tên
                </th>
                <td className="fw-semibold">{personalInfo.fullName}</td>
              </tr>
              <tr>
                <th className="bg-light text-secondary">Ngày sinh</th>
                <td className="fw-semibold">
                  {formatDate(personalInfo.dateOfBirth)}
                </td>
              </tr>
              <tr>
                <th className="bg-light text-secondary">Địa chỉ</th>
                <td className="fw-semibold">{personalInfo.address}</td>
              </tr>
              <tr>
                <th className="bg-light text-secondary">Số điện thoại</th>
                <td className="fw-semibold">{personalInfo.phone}</td>
              </tr>
              <tr>
                <th className="bg-light text-secondary">Chức vụ</th>
                <td className="fw-semibold">{personalInfo.job}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center mt-4">
            <button
              className="btn btn-primary btn-lg px-4 shadow-sm"
              onClick={handleEditClick}
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewsProfile;
