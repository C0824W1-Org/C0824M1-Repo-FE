import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewsProfile = () => {
  const navigate = useNavigate();
  const { userLogin } = useSelector((state) => state.auth);

  // Kiểm tra nếu không có thông tin người dùng
  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-5">
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const { personalInfo } = userLogin;

  // Xử lý khi nhấn nút "Chỉnh sửa"
  const handleEditClick = () => {
    navigate("/admin/edit-profile");
  };

  return (
    <div className="content container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-4">Thông tin người dùng</h5>
          <div className="text-center mb-4">
            {personalInfo.avatar ? (
              <img
                src={personalInfo.avatar}
                alt="User Avatar"
                style={{ maxWidth: "150px", borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                Chưa có ảnh
              </div>
            )}
          </div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="fw-bold" scope="row" style={{ width: "20%" }}>
                  Họ và tên
                </th>
                <td>{personalInfo.fullName}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Ngày sinh
                </th>
                <td>{personalInfo.dateOfBirth}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Địa chỉ
                </th>
                <td>{personalInfo.address}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Số điện thoại
                </th>
                <td>{personalInfo.phone}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Chức vụ
                </th>
                <td>{personalInfo.job}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary mt-3" onClick={handleEditClick}>
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewsProfile;
