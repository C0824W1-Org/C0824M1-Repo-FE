import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SalesService from "../../../services/Sales.service";
import { toast } from "react-toastify";
import { Form, Button } from "react-bootstrap";

const EditSale = () => {
  const navigate = useNavigate();
  const { saleId } = useParams();
  const [formData, setFormData] = useState({
    customer: { fullName: "", phone: "" },
    totalAmount: "",
    date: "",
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu giao dịch khi component mount
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const sale = await SalesService.getSaleById(saleId);
        if (sale) {
          setFormData({
            customer: { ...sale.customer },
            totalAmount: sale.totalAmount,
            date: new Date(sale.date).toISOString().slice(0, 16),
            products: sale.products || [],
          });
        } else {
          setError("Không tìm thấy giao dịch với ID này");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải thông tin giao dịch");
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId]);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("customer.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Xử lý lưu sửa đổi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSale = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
        date: new Date(formData.date).toISOString(),
        products: formData.products,
      };
      await SalesService.updateSale(saleId, updatedSale);
      toast.success("Cập nhật giao dịch thành công!");
      navigate("/admin/revenue-management");
    } catch (err) {
      toast.error(`Có lỗi khi cập nhật giao dịch: ${err.message}`);
      console.error("Lỗi cập nhật:", err);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate("/admin/revenue-management");
  };

  if (loading) {
    return (
      <div className="text-center py-5">Đang tải thông tin giao dịch...</div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="content container-fluid p-4">
      <h2 className="mb-4">Sửa giao dịch</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên khách hàng</Form.Label>
              <Form.Control
                type="text"
                name="customer.fullName"
                value={formData.customer.fullName || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="customer.phone"
                value={formData.customer.phone || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tổng tiền</Form.Label>
              <Form.Control
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày giao dịch</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={formData.date || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Lưu thay đổi
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditSale;
