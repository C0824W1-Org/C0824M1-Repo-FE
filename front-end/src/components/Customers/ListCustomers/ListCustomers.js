import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../services/Customers.service";
import { toast } from "react-toastify";

const ListCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomersService.getAllCustomers();
        if (Array.isArray(response)) {
          setCustomers(response);
          setFilteredCustomers(response);
        } else {
          console.error("Dữ liệu không phải mảng:", response);
          setCustomers([]);
          setFilteredCustomers([]);
          toast.error("Dữ liệu từ server không đúng định dạng.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách khách hàng");
        setLoading(false);
        toast.error(err.message);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const fullNameMatch = customer.fullName
        .toLowerCase()
        .includes(searchCriteria.fullName.toLowerCase());
      const phoneMatch = customer.phone.includes(searchCriteria.phone);
      return fullNameMatch && phoneMatch;
    });
    setFilteredCustomers(filtered);
  }, [searchCriteria, customers]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await CustomersService.deleteCustomer(id);
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        setFilteredCustomers((prev) =>
          prev.filter((customer) => customer.id !== id)
        );
        toast.success("Xóa khách hàng thành công!");
      } catch (err) {
        toast.error(`Có lỗi khi xóa khách hàng: ${err.message}`);
        console.error("Lỗi khi xóa khách hàng:", err);
      }
    }
  };

  const handleAdd = () => {
    navigate("/admin/add-customers"); // Sửa thành đường dẫn đầy đủ
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-customers/${id}`); // Sửa thành đường dẫn đầy đủ
  };

  if (loading) {
    return <div>Đang tải danh sách khách hàng...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="content container-fluid">
      <h2>Danh sách khách hàng</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Danh sách khách hàng</h5>
          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-primary" onClick={handleAdd}>
              Thêm khách hàng
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
          </div>
          {filteredCustomers.length === 0 ? (
            <p>Không có khách hàng nào phù hợp với tiêu chí tìm kiếm.</p>
          ) : (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tuổi</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.fullName}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td>{customer.age}</td>
                    <td>{customer.email || "-"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(customer.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCustomers;
