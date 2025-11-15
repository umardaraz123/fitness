import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import ProductFormModal from '../components/ProductFormModal';

const AdminProducts = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.current_page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page
      };

      const response = await productAPI.getProductsAdmin(params);
      
      if (response.success) {
        setProducts(response.data || []);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          per_page: response.pagination?.per_page || 12,
          total: response.pagination?.total || 0,
          last_page: response.pagination?.last_page || 1
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await productAPI.deleteProduct(productId);
      
      if (response.success) {
        showSuccess('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showError(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleProductSaved = () => {
    setShowProductModal(false);
    fetchProducts();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Product Management</h1>
        </div>
        <div className="header-right">
          <button className="create-btn primary" onClick={handleCreateProduct}>
            <Plus size={20} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-number">{pagination.total}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {products.filter(p => p.status === 'active').length}
            </div>
            <div className="stat-label">Active Products</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">
              {products.filter(p => p.discount_price).length}
            </div>
            <div className="stat-label">On Sale</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-number">
              {products.filter(p => p.is_featured === true || p.is_featured === 1).length}
            </div>
            <div className="stat-label">Featured</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Products</h3>
          <div className="table-count">
            {pagination.total > 0 
              ? `${((pagination.current_page - 1) * pagination.per_page) + 1} - ${Math.min(pagination.current_page * pagination.per_page, pagination.total)} of ${pagination.total}`
              : '0 products'
            }
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found</p>
            <button className="create-btn primary" onClick={handleCreateProduct}>
              <Plus size={20} />
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <div className="table-row head">
                <div className="table-cell">Image</div>
                <div className="table-cell name-header">Product Name</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>

            <div className="table-body">
              {products.map((product) => (
                <div className="table-row">
                  <div className="table-cell">
                    <div className="product-image-cell">
                      {product.image_url || product.image ? (
                        <img src={product.image_url || product.image} alt={product.name} />
                      ) : product.gallery_images && product.gallery_images.length > 0 ? (
                        <img src={product.gallery_images[0].image_url} alt={product.name} />
                      ) : (
                        <div className="no-image">📦</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className="product-name-main">{product.name}</div>
                  </div>
                  
                  <div className="table-cell">
                    <span className="category-badge">{product.category?.name || '-'}</span>
                  </div>
                  
                  <div className="table-cell">
                    <div className="price-cell">
                      {product.discount_price ? (
                        <>
                          <span className="sale-price">${product.discount_price}</span>
                          <span className="original-price">${product.price}</span>
                        </>
                      ) : (
                        <span className="regular-price">${product.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <span className={`status-badge ${product.status === 'active' ? 'active' : 'inactive'}`}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="table-cell action-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditProduct(product)}
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteProduct(product.guid)}
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {[...Array(pagination.last_page)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`page-number ${pagination.current_page === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              className="page-btn"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={selectedProduct}
        onSave={handleProductSaved}
      />
    </div>
  );
};

export default AdminProducts;
