import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mealAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import MealFormModal from '../components/MealFormModal';

const AdminMeals = () => {
  const { showSuccess, showError } = useToast();
  
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    fetchMeals();
  }, [pagination.current_page]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page
      };

      const response = await mealAPI.getMealsAdmin(params);
      
      if (response.success) {
        setMeals(response.data || []);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          per_page: response.pagination?.per_page || 12,
          total: response.pagination?.total || 0,
          last_page: response.pagination?.last_page || 1
        });
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      showError('Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeal = () => {
    setSelectedMeal(null);
    setShowMealModal(true);
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setShowMealModal(true);
  };

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    try {
      const response = await mealAPI.deleteMeal(mealId);
      
      if (response.success) {
        showSuccess('Meal deleted successfully');
        fetchMeals();
      }
    } catch (error) {
      console.error('Error deleting meal:', error);
      showError(error.response?.data?.message || 'Failed to delete meal');
    }
  };

  const handleMealSaved = () => {
    setShowMealModal(false);
    fetchMeals();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Meal Management</h1>
        </div>
        <div className="header-right">
          <button className="create-btn primary" onClick={handleCreateMeal}>
            <Plus size={20} />
            Add New Meal
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <div className="stat-number">{pagination.total}</div>
            <div className="stat-label">Total Meals</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {meals.filter(m => m.status === 1 || m.status === true).length}
            </div>
            <div className="stat-label">Active Meals</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">
              {meals.filter(m => m.sale_price).length}
            </div>
            <div className="stat-label">On Sale</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-number">
              {meals.filter(m => m.is_featured === true || m.is_featured === 1).length}
            </div>
            <div className="stat-label">Featured</div>
          </div>
        </div>
      </div>

      {/* Meals Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Meals</h3>
          <div className="table-count">
            {pagination.total > 0 
              ? `${((pagination.current_page - 1) * pagination.per_page) + 1} - ${Math.min(pagination.current_page * pagination.per_page, pagination.total)} of ${pagination.total}`
              : '0 meals'
            }
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading meals...</p>
          </div>
        ) : meals.length === 0 ? (
          <div className="empty-state">
            <p>No meals found</p>
            <button className="create-btn primary" onClick={handleCreateMeal}>
              <Plus size={20} />
              Create Your First Meal
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <div className="table-row head">
                <div className="table-cell">Image</div>
                <div className="table-cell name-header">Meal Name</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Calories</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>

            <div className="table-body">
              {meals.map((meal) => (
                <div key={meal.id} className="table-row">
                  <div className="table-cell">
                    <div className="product-image-cell">
                    
                      {meal.image_url ? (
                        <img src={meal.image_url} alt={meal.name} onError={(e) => {
                          // If main image fails, try first gallery image
                          if (meal.gallery_images && meal.gallery_images.length > 0) {
                            e.target.src = meal.gallery_images[0].image_url;
                          } else {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="no-image">🍽️</div>';
                          }
                        }} />
                      ) : meal.gallery_images && meal.gallery_images.length > 0 ? (
                        <img src={meal.gallery_images[0].image_url} alt={meal.name} />
                      ) : (
                        <div className="no-image">🍽️</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className="product-name-main">{meal.name}</div>
                    {meal.type && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{meal.type}</div>}
                  </div>
                  
                  <div className="table-cell">
                    <span className="category-badge">{meal.category?.name || '-'}</span>
                  </div>
                  
                  <div className="table-cell">
                    <div className="price-cell">
                      {meal.sale_price ? (
                        <>
                          <span className="sale-price">${meal.sale_price}</span>
                          <span className="original-price">${meal.price}</span>
                        </>
                      ) : (
                        <span className="regular-price">${meal.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="table-cell">
                    {meal.calories ? (
                      <span style={{ 
                        padding: '4px 8px', 
                        background: '#2c2c2c', 
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        {meal.calories} cal
                      </span>
                    ) : '-'}
                  </div>
                  
                  <div className="table-cell">
                    <span className={`status-badge ${meal.status === 1 || meal.status === true ? 'active' : 'inactive'}`}>
                      {meal.status === 1 || meal.status === true ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="table-cell action-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditMeal(meal)}
                      title="Edit Meal"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteMeal(meal.guid)}
                      title="Delete Meal"
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

      {/* Meal Form Modal */}
      <MealFormModal
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        meal={selectedMeal}
        onSave={handleMealSaved}
      />
    </div>
  );
};

export default AdminMeals;
