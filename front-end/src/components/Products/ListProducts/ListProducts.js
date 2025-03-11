import React, { useState, useEffect } from "react";
import ProductsService from "../../../services/Products.service";
import { toast } from "react-toastify";

const ListProducts = ({ onPageChange }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    brand: "",
  });

  // Lấy danh sách hàng hóa khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductsService.getAllProducts();
        // Thêm trường "brand" dựa trên tên sản phẩm
        const productsWithBrand = response.map((product) => ({
          ...product,
          brand: product.name.includes("iPhone") ? "Apple" : "Samsung",
        }));
        setProducts(productsWithBrand);
        setFilteredProducts(productsWithBrand);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải danh sách hàng hóa");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({
      ...prev,
      [name]: value,
    }));

    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchCriteria.name.toLowerCase());
      const brandMatch = searchCriteria.brand
        ? product.brand === searchCriteria.brand
        : true;
      return nameMatch && brandMatch;
    });
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchCriteria.name.toLowerCase());
      const brandMatch = searchCriteria.brand
        ? product.brand === searchCriteria.brand
        : true;
      return nameMatch && brandMatch;
    });
    setFilteredProducts(filtered);
  }, [searchCriteria, products]);

  // Xử lý xóa hàng hóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hàng hóa này?")) {
      try {
        await ProductsService.deleteProduct(id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        toast.success("Xóa hàng hóa thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa hàng hóa:", err.response || err.message);
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Có lỗi xảy ra khi xóa hàng hóa."
        );
      }
    }
  };

  // Chuyển sang trang thêm hàng hóa
  const handleAdd = () => {
    onPageChange("AddProducts");
  };

  // Chuyển sang trang sửa hàng hóa
  const handleEdit = (id) => {
    onPageChange("EditProducts", { productId: id });
  };

  if (loading) {
    return <div>Đang tải danh sách hàng hóa...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="content container-fluid">
      <h2>Danh sách hàng hóa</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Danh sách hàng hóa</h5>
          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-primary" onClick={handleAdd}>
              Thêm hàng hóa
            </button>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Tìm theo tên"
              value={searchCriteria.name}
              onChange={handleSearchChange}
            />
            <select
              className="form-control"
              name="brand"
              value={searchCriteria.brand}
              onChange={handleSearchChange}
            >
              <option value="">Tất cả hãng</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
            </select>
          </div>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Hãng</th>
                <th>CPU</th>
                <th>Bộ nhớ</th>
                <th>Hệ điều hành</th>
                <th>Giá</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.cpu}</td>
                  <td>{product.storage}</td>
                  <td>{product.os}</td>
                  <td>{product.price.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(product.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.id)}
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

export default ListProducts;
