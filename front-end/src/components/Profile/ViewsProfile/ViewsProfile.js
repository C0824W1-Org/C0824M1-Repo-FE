import React from "react";
import { useSelector } from "react-redux";

const ViewsProfile = ({ onPageChange }) => {
  const { userLogin } = useSelector((state) => state.auth);

  // Kiểm tra nếu không có thông tin người dùng
  if (!userLogin || Object.keys(userLogin).length === 0) {
    return <div>Không có thông tin người dùng. Vui lòng đăng nhập lại.</div>;
  }

  const { personalInfo, username, role } = userLogin;

  // Xử lý khi nhấn nút "Chỉnh sửa"
  const handleEditClick = () => {
    onPageChange("editProfile"); // Chuyển sang trang EditProfile
  };

  return (
    <div className="content container-fluid">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Thông tin người dùng</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th scope="row">Họ và tên</th>
                <td>{personalInfo.fullName}</td>
              </tr>
              <tr>
                <th scope="row">Ngày sinh</th>
                <td>{personalInfo.dateOfBirth}</td>
              </tr>
              <tr>
                <th scope="row">Địa chỉ</th>
                <td>{personalInfo.address}</td>
              </tr>
              <tr>
                <th scope="row">Số điện thoại</th>
                <td>{personalInfo.phone}</td>
              </tr>
              <tr>
                <th scope="row">Chức vụ</th>
                <td>{personalInfo.job}</td>
              </tr>
              <tr></tr>
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
