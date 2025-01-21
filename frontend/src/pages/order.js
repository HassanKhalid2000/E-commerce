import '../css/order.css';



function confirmOrder() {
    const deliveryLocation = document.getElementById("delivery-location").value;

    if (!deliveryLocation) {
        alert("يرجى إدخال مكان التوصيل!");
        return;
    }

    const order = {
        items: [
            { name: "سيارة", quantity: 1, price: 5000 },
            { name: "حاسب آلي", quantity: 1, price: 220 }
        ],
        total: 5220,
        deliveryLocation
    };

    fetch("/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => alert("تم تأكيد عملية الشراء بنجاح!"))
    .catch(error => console.error("Error:", error));
}
