import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import CategoryFormModal from '../components/CategoryFormModal';

const AdminCategories = () => {
  const { showSuccess, showError } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    fetchCategories();
  }, [pagination.current_page, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        sort_by: sortBy,
        sort_order: sortOrder
      };

      const response = await productAPI.getCategoriesAdmin(params);
      
      if (response.success) {
        setCategories(response.data || []);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          per_page: response.pagination?.per_page || 10,
          total: response.pagination?.total || 0,
          last_page: response.pagination?.last_page || 1
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? All products in this category will be uncategorized.')) {
      return;
    }

    try {
      const response = await productAPI.deleteCategory(categoryId);
      
      if (response.success) {
        showSuccess('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCategorySaved = () => {
    setShowCategoryModal(false);
    fetchCategories();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Category Management</h1>
        </div>
        <div className="header-right">
          <button className="create-btn primary" onClick={handleCreateCategory}>
            <Plus size={20} />
            Add New Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <div className="stat-number">{pagination.total}</div>
            <div className="stat-label">Total Categories</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {categories.filter(c => c.status === 'active').length}
            </div>
            <div className="stat-label">Active Categories</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">
              {categories.filter(c => c.status === 'inactive').length}
            </div>
            <div className="stat-label">Inactive Categories</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-number">
              {categories.filter(c => !c.parent_id).length}
            </div>
            <div className="stat-label">Parent Categories</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="filter-row">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="created_at">Date Created</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Categories</h3>
          <div className="table-count">
            {pagination.total > 0 
              ? `${((pagination.current_page - 1) * pagination.per_page) + 1} - ${Math.min(pagination.current_page * pagination.per_page, pagination.total)} of ${pagination.total}`
              : '0 categories'
            }
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories found</p>
            <button className="create-btn primary" onClick={handleCreateCategory}>
              <Plus size={20} />
              Create Your First Category
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <div className="table-row head">
                <div className="table-cell name-header">Category Name</div>
                <div className="table-cell">Type</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>

            <div className="table-body">
              {categories.map((category) => (
                <div key={category.id} className="table-row">
                  <div className="table-cell">
                    <div className="category-name-main">{category.name}</div>
                  </div>
                  
                  <div className="table-cell">
                    <span className="type-text">{category.type || '-'}</span>
                  </div>
                  
                  <div className="table-cell">
                    <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="table-cell action-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditCategory(category)}
                      title="Edit Category"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteCategory(category.guid)}
                      title="Delete Category"
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

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategory}
        categories={categories.filter(c => !c.parent_id)} // Only parent categories for parent selection
        onSave={handleCategorySaved}
      />
    </div>
  );
};

export default AdminCategories;
