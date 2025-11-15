import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { planAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import PlanFormModal from '../components/PlanFormModal';

const AdminPlans = () => {
  const { showSuccess, showError } = useToast();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    fetchPlans();
  }, [pagination.current_page]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page
      };

      const response = await planAPI.getPlansAdmin(params);
      
      if (response.success) {
        // Handle nested data structure from API
        const plansData = response.data?.data || response.data || [];
        setPlans(Array.isArray(plansData) ? plansData : []);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          per_page: response.pagination?.per_page || 12,
          total: response.pagination?.total || 0,
          last_page: response.pagination?.last_page || 1
        });
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      showError('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const response = await planAPI.deletePlan(planId);
      
      if (response.success) {
        showSuccess('Plan deleted successfully');
        fetchPlans();
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showError(error.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handlePlanSaved = () => {
    setShowPlanModal(false);
    fetchPlans();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const formatPlanType = (type) => {
    return type.replace('_', ' ');
  };

  const formatCategory = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Plan Management</h1>
        </div>
        <div className="header-right">
          <button className="create-btn primary" onClick={handleCreatePlan}>
            <Plus size={20} />
            Add New Plan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-number">{pagination.total}</div>
            <div className="stat-label">Total Plans</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">
              {plans.filter(p => p.is_active === 1 || p.is_active === true).length}
            </div>
            <div className="stat-label">Active Plans</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">
              {plans.filter(p => p.sale_price).length}
            </div>
            <div className="stat-label">On Sale</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <div className="stat-number">
              {plans.filter(p => p.is_featured === true || p.is_featured === 1).length}
            </div>
            <div className="stat-label">Featured</div>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Plans</h3>
          <div className="table-count">
            {pagination.total > 0 
              ? `${((pagination.current_page - 1) * pagination.per_page) + 1} - ${Math.min(pagination.current_page * pagination.per_page, pagination.total)} of ${pagination.total}`
              : '0 plans'
            }
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <p>No plans found</p>
            <button className="create-btn primary" onClick={handleCreatePlan}>
              <Plus size={20} />
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <div className="table-row head">
                <div className="table-cell">Image</div>
                <div className="table-cell name-header">Plan Title</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Duration</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>

            <div className="table-body">
              {plans.map((plan) => (
                <div key={plan.id} className="table-row">
                  <div className="table-cell">
                    <div className="product-image-cell">
                      {plan.image_url || plan.image ? (
                        <img src={plan.image_url || plan.image} alt={plan.title} onError={(e) => {
                          if (plan.gallery_images && plan.gallery_images.length > 0) {
                            e.target.src = plan.gallery_images[0].image_url;
                          } else {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="no-image">📋</div>';
                          }
                        }} />
                      ) : plan.gallery_images && plan.gallery_images.length > 0 ? (
                        <img src={plan.gallery_images[0].image_url} alt={plan.title} />
                      ) : (
                        <div className="no-image">📋</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className="product-name-main">{plan.title}</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                      {plan.plan_type_label || formatPlanType(plan.plan_type)} • {plan.intensity_level_label || plan.intensity_level}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <span className="category-badge">{plan.plan_category_label || formatCategory(plan.plan_category)}</span>
                  </div>
                  
                  <div className="table-cell">
                    <div className="price-cell">
                      {plan.sale_price ? (
                        <>
                          <span className="sale-price">${plan.sale_price}</span>
                          <span className="original-price">${plan.price}</span>
                        </>
                      ) : (
                        <span className="regular-price">${plan.price}</span>
                      )}
                    </div>
                  </div>

                  <div className="table-cell">
                    {plan.duration_formatted || plan.duration_days ? (
                      <span style={{ 
                        padding: '4px 8px', 
                        background: '#2c2c2c', 
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        {plan.duration_formatted || `${plan.duration_days} days`}
                      </span>
                    ) : '-'}
                  </div>
                  
                  <div className="table-cell">
                    <span className={`status-badge ${plan.is_active === 1 || plan.is_active === true ? 'active' : 'inactive'}`}>
                      {plan.is_active === 1 || plan.is_active === true ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="table-cell action-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditPlan(plan)}
                      title="Edit Plan"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeletePlan(plan.guid)}
                      title="Delete Plan"
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

      {/* Plan Form Modal */}
      <PlanFormModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        plan={selectedPlan}
        onSave={handlePlanSaved}
      />
    </div>
  );
};

export default AdminPlans;
