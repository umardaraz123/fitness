import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { workoutAPI, productAPI } from '../services/api.service';
import { useToast } from '../context/ToastContext';
import WorkoutFormModal from '../components/WorkoutFormModal';

const AdminWorkouts = () => {
  const { showSuccess, showError } = useToast();
  
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
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
    fetchWorkouts();
  }, [pagination.current_page, searchTerm, categoryFilter, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category_id: categoryFilter }),
        sort_by: sortBy,
        sort_order: sortOrder
      };

      const response = await workoutAPI.getWorkoutsAdmin(params);
      
      if (response.success) {
        setWorkouts(response.data || []);
        setPagination({
          current_page: response.pagination?.current_page || 1,
          per_page: response.pagination?.per_page || 10,
          total: response.pagination?.total || 0,
          last_page: response.pagination?.last_page || 1
        });
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      showError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = () => {
    setSelectedWorkout(null);
    setShowWorkoutModal(true);
  };

  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setShowWorkoutModal(true);
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      const response = await workoutAPI.deleteWorkout(workoutId);
      
      if (response.success) {
        showSuccess('Workout deleted successfully');
        fetchWorkouts();
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
      showError(error.response?.data?.message || 'Failed to delete workout');
    }
  };

  const handleWorkoutSaved = () => {
    setShowWorkoutModal(false);
    fetchWorkouts();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Workout Management</h1>
        </div>
        <div className="header-right">
          <button className="create-btn primary" onClick={handleCreateWorkout}>
            <Plus size={20} />
            Add New Workout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-number">{pagination.total}</div>
            <div className="stat-label">Total Workouts</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">🏋️</div>
          <div className="stat-content">
            <div className="stat-number">
              {workouts.filter(w => w.duration_minutes <= 30).length}
            </div>
            <div className="stat-label">Short Workouts (≤30min)</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-number">
              {workouts.filter(w => w.duration_minutes > 30 && w.duration_minutes <= 60).length}
            </div>
            <div className="stat-label">Medium (30-60min)</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">
              {workouts.filter(w => w.duration_minutes > 60).length}
            </div>
            <div className="stat-label">Long Workouts (&gt;60min)</div>
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
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="duration_minutes">Duration</option>
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

      {/* Workouts Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Workouts</h3>
          <div className="table-count">
            {pagination.total > 0 
              ? `${((pagination.current_page - 1) * pagination.per_page) + 1} - ${Math.min(pagination.current_page * pagination.per_page, pagination.total)} of ${pagination.total}`
              : '0 workouts'
            }
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading workouts...</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts found</p>
            <button className="create-btn primary" onClick={handleCreateWorkout}>
              <Plus size={20} />
              Create Your First Workout
            </button>
          </div>
        ) : (
          <div className="admin-table">
            <div className="table-head">
              <div className="table-row head">
                <div className="table-cell">Image</div>
                <div className="table-cell name-header">Workout Name</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Duration</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>

            <div className="table-body">
              {workouts.map((workout) => (
                <div key={workout.id} className="table-row">
                  <div className="table-cell">
                    <div className="product-image-cell">
                      {workout.image ? (
                        <img src={workout.image} alt={workout.name} />
                      ) : (
                        <div className="no-image">💪</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className="product-name-main">{workout.name}</div>
                  </div>
                  
                  <div className="table-cell">
                    <span className="category-badge">{workout.category?.name || '-'}</span>
                  </div>
                  
                  <div className="table-cell">
                    <span className="duration-badge">{workout.duration_minutes} min</span>
                  </div>
                  
                  <div className="table-cell action-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditWorkout(workout)}
                      title="Edit Workout"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteWorkout(workout.guid)}
                      title="Delete Workout"
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

      {/* Workout Form Modal */}
      <WorkoutFormModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        workout={selectedWorkout}
        categories={categories}
        onSave={handleWorkoutSaved}
      />
    </div>
  );
};

export default AdminWorkouts;
