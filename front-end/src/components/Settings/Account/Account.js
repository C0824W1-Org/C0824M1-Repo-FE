// components/Settings/Account.js
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Account = () => {
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

  const { username, password, role } = userLogin;

  // Xử lý khi nhấn nút "Đổi mật khẩu"
  const handleEditPassword = () => {
    navigate("/admin/edit-account");
  };

  return (
    <div className="content container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-bold mb-4">Thông tin tài khoản</h5>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="fw-bold" scope="row" style={{ width: "20%" }}>
                  Tên đăng nhập
                </th>
                <td>{username}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Mật khẩu
                </th>
                <td>{password}</td>
              </tr>
              <tr>
                <th className="fw-bold" scope="row">
                  Vai trò
                </th>
                <td>{role}</td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary mt-3" onClick={handleEditPassword}>
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
