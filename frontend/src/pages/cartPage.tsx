import { useState } from "react";
import Swal from "sweetalert2"; // استيراد SweetAlert2
import axios from "axios"; // استيراد Axios
import "./CartPage.css"; // استيراد ملف الـ CSS

const CartPage = () => {
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [fullName, setFullName] = useState(""); // حالة للاسم الكامل
  const [phoneNumber, setPhoneNumber] = useState(""); // حالة لرقم الهاتف

  const [items, setItems] = useState([
    {
      id: 1,
      name: "Mercedes",
      price: 30000000,
      quantity: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBmBumXgjoOGtpEBYsglSz21dP44ADyjARoQ&s",
    },
    {
      id: 2,
      name: "Iphone 16 Pro Max",
      price: 1000,
      quantity: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqRdP5X0phTACrCkFmCjgNSryF1AmdiZAMjzTRDfg49ZUNXhXScNve31fIy59CNloGZeM&usqp=CAU",
    },
  ]);

  // حساب المجموع
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // زيادة الكمية
  const increaseQuantity = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // إنقاص الكمية
  const decreaseQuantity = (id) => {
    setItems(
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const confirmOrder = async () => {
    if (deliveryLocation.trim() === "" || fullName.trim() === "" || phoneNumber.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "يرجى إدخال جميع البيانات المطلوبة",
      });
      return;
    }

    const orderData = {
      deliveryLocation,
      fullName,
      phoneNumber,
      items,
      totalPrice: calculateTotal(),
    };

    try {
      // إرسال البيانات إلى السيرفر
      const response = await axios.post("http://localhost:5005/cart/testOrder", orderData);
      Swal.fire({
        icon: "success",
        title: "نجاح",
        text: "تم تأكيد عملية الشراء وحفظ البيانات!",
      });
      console.log(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "فشل",
        text: "فشل في حفظ البيانات، حاول مجددًا.",
      });
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="order-details">
        <h3>مكان التوصيل</h3>
        <input
          type="text"
          value={deliveryLocation}
          onChange={(e) => setDeliveryLocation(e.target.value)}
          placeholder="أدخل مكان التوصيل"
        />

        <h3>الاسم الكامل</h3>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="أدخل اسمك بالكامل"
        />

        <h3>رقم الهاتف</h3>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="أدخل رقم هاتفك"
        />

        <div className="items">
          {items.map((item) => (
            <div key={item.id} className="item">
              <img src={item.image} alt={item.name} className="icon" />
              <span>{item.name}</span>
              <div className="quantity-controls">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
              </div>
              <span>
                {item.quantity} X {item.price.toLocaleString()}$
              </span>
            </div>
          ))}
        </div>

        <div className="total">
          <span>المجموع هو:</span>
          <strong>${calculateTotal().toLocaleString()}</strong>
        </div>

        <button className="confirm-btn" onClick={confirmOrder}>
          تأكيد عملية الشراء
        </button>
      </div>
    </div>
  );
};

export default CartPage;
