import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UsersService from "../../../services/Users.service";
import { login } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const { userLogin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Khởi tạo state cho các trường có thể chỉnh sửa
  const [formData, setFormData] = useState(
    userLogin && Object.keys(userLogin).length > 0
      ? {
          fullName: userLogin.personalInfo.fullName,
          dateOfBirth: userLogin.personalInfo.dateOfBirth,
          address: userLogin.personalInfo.address,
          phone: userLogin.personalInfo.phone,
        }
      : {
          fullName: "",
          dateOfBirth: "",
          address: "",
          phone: "",
        }
  );

  // Kiểm tra nếu không có thông tin người dùng
  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-5">
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  // Xử lý thay đổi giá trị input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...userLogin,
        personalInfo: {
          ...userLogin.personalInfo,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          phone: formData.phone,
        },
      };

      await UsersService.updateUser(userLogin.id, updatedUser);
      dispatch(login(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Cập nhật thông tin thành công!");
      navigate("/admin/views-profile");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  // Xử lý khi hủy chỉnh sửa
  const handleCancel = () => {
    navigate("/admin/views-profile");
  };

  return (
    <div className="content container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Cập nhật thông tin</h5>
          <form onSubmit={handleSubmit}>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row" style={{ width: "20%" }}>
                    Họ và tên
                  </th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Ngày sinh</th>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Địa chỉ</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Số điện thoại</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Chức vụ</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={userLogin.personalInfo.job}
                      disabled
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
