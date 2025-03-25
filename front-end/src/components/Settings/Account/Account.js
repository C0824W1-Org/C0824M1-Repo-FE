import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const { userLogin } = useSelector((state) => state.auth);

  // Kiểm tra nếu không có thông tin người dùng
  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-3" style={{ fontSize: "0.85rem" }}>
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
    <div className="container py-2">
      <div
        className="card shadow-lg rounded-3 border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-3">
          <h5
            className="card-title fw-bold mb-3 text-center"
            style={{ fontSize: "1.1rem" }}
          >
            Thông tin tài khoản
          </h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th
                    scope="row"
                    style={{ width: "30%", fontSize: "0.85rem" }}
                    className="fw-bold"
                  >
                    Tên đăng nhập
                  </th>
                  <td style={{ fontSize: "0.85rem" }}>{username}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    style={{ fontSize: "0.85rem" }}
                    className="fw-bold"
                  >
                    Mật khẩu
                  </th>
                  <td style={{ fontSize: "0.85rem" }}>{password}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    style={{ fontSize: "0.85rem" }}
                    className="fw-bold"
                  >
                    Vai trò
                  </th>
                  <td style={{ fontSize: "0.85rem" }}>{role}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn btn-primary fw-bold px-3 py-1 d-flex align-items-center gap-1 mx-auto"
              onClick={handleEditPassword}
              style={{ fontSize: "0.85rem" }}
            >
              <i
                className="bi bi-lock-fill"
                style={{ fontSize: "0.85rem" }}
              ></i>{" "}
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
