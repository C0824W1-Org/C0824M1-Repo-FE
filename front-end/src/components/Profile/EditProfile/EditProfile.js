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

  const [formData, setFormData] = useState(
    userLogin && Object.keys(userLogin).length > 0
      ? {
          fullName: userLogin.personalInfo.fullName,
          dateOfBirth: userLogin.personalInfo.dateOfBirth,
          address: userLogin.personalInfo.address,
          phone: userLogin.personalInfo.phone,
          avatar: userLogin.personalInfo.avatar || "",
        }
      : {
          fullName: "",
          dateOfBirth: "",
          address: "",
          phone: "",
          avatar: "",
        }
  );

  if (!userLogin || Object.keys(userLogin).length === 0) {
    return (
      <div className="text-center py-5">
        Không có thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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
          avatar: formData.avatar,
        },
      };

      // Cập nhật dữ liệu lên server
      await UsersService.updateUser(userLogin.id, updatedUser);
      // Cập nhật Redux store
      dispatch(login(updatedUser));
      // Cập nhật localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Cập nhật thông tin thành công!");
      navigate("/admin/views-profile");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

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
                <tr>
                  <th scope="row">Ảnh đại diện</th>
                  <td>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {formData.avatar && (
                      <img
                        src={formData.avatar}
                        alt="Avatar Preview"
                        style={{ maxWidth: "100px", marginTop: "10px" }}
                      />
                    )}
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
