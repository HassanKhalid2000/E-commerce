import React, { useState, useEffect } from 'react';
import axios from 'axios';

// تعريف واجهة المنتج
interface Product {
  _id: string;
  title: string;
  image: string;
  stock: number;
  price: number;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    _id: '',
    title: '',
    image: '',
    stock: 0,
    price: 0,
  });

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // جلب المنتجات من API
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleAddProduct = () => {
    axios.post('http://localhost:5000/api/products', newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct({ _id: '', title: '', image: '', stock: 0, price: 0 });
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = () => {
    if (editProduct) {
      axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct)
        .then((response) => {
          setProducts(products.map((product) => product._id === editProduct._id ? response.data : product));
          setEditProduct(null);
        })
        .catch((error) => console.error('Error updating product:', error));
    }
  };

  const handleDeleteProduct = (id: string) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  return (
    <div className="product-management">
      <h1>إدارة المخزن</h1>

      {/* إضافة منتج */}
      <div className="add-product">
        <input
          type="text"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          placeholder="اسم المنتج"
        />
        <input
          type="text"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          placeholder="رابط الصورة"
        />
        <input
          type="number"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
          placeholder="العدد"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
          placeholder="السعر"
        />
        <button onClick={handleAddProduct}>إضافة منتج</button>
      </div>

      {/* تعديل منتج */}
      {editProduct && (
        <div className="edit-product">
          <h2>تعديل المنتج</h2>
          <input
            type="text"
            value={editProduct.title}
            onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
            placeholder="اسم المنتج"
          />
          <input
            type="text"
            value={editProduct.image}
            onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
            placeholder="رابط الصورة"
          />
          <input
            type="number"
            value={editProduct.stock}
            onChange={(e) => setEditProduct({ ...editProduct, stock: +e.target.value })}
            placeholder="العدد"
          />
          <input
            type="number"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: +e.target.value })}
            placeholder="السعر"
          />
          <button onClick={handleUpdateProduct}>تحديث المنتج</button>
        </div>
      )}

      {/* عرض المنتجات */}
      <div className="product-list">
        <h2>قائمة المنتجات</h2>
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <div className="product-item">
                <img src={product.image} alt={product.title} width="100" />
                <div>
                  <h3>{product.title}</h3>
                  <p>السعر: {product.price} | العدد: {product.stock}</p>
                  <button onClick={() => handleEditProduct(product)}>تعديل</button>
                  <button onClick={() => handleDeleteProduct(product._id)}>حذف</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;
