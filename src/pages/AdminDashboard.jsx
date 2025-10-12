import React, { useState } from 'react';
import QuestionnaireModal from '../components/QuestionnaireModal';
import CreateWorkoutModal from '../components/CreateWorkoutModal';

const AdminDashboard = () => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [showCreateWorkoutModal, setShowCreateWorkoutModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Mock client data
  const clients = [
    {
      id: 1,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 2,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Weight Loss',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 3,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Weight Gain',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 4,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 5,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 6,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 7,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 8,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 9,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    },
    {
      id: 10,
      name: 'Ernest Houston',
      email: 'ernest@linkedin.com',
      workoutPlan: 'Create',
      progress: 30,
      avatar: '/src/assets/images/user1.jpg'
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleViewQuestionnaire = (client) => {
    setSelectedClient(client);
    setShowQuestionnaireModal(true);
  };

  const closeQuestionnaireModal = () => {
    setShowQuestionnaireModal(false);
    setSelectedClient(null);
  };

  const handleCreateWorkout = (client) => {
    setSelectedClient(client);
    setShowCreateWorkoutModal(true);
  };

  const closeCreateWorkoutModal = () => {
    setShowCreateWorkoutModal(false);
    setSelectedClient(null);
  };

  return (
    <div className="admin-dashboard">
      {/* Top Section with Client List Header and Date Filters */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Client List</h1>
        </div>
        <div className="header-right">
          <div className="date-filters">
            <input 
              type="date" 
              className="date-filter-input" 
              defaultValue="2021-06-10"
            />
            <input 
              type="date" 
              className="date-filter-input" 
              defaultValue="2021-10-10"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total-clients">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">250</div>
            <div className="stat-label">Total Clients</div>
          </div>
        </div>
        
        <div className="stat-card new-clients">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-number">15</div>
            <div className="stat-label">New Clients</div>
          </div>
        </div>
        
        <div className="stat-card female-clients">
          <div className="stat-icon">♀️</div>
          <div className="stat-content">
            <div className="stat-number">200</div>
            <div className="stat-label">Female clients</div>
          </div>
        </div>
        
        <div className="stat-card male-clients">
          <div className="stat-icon">♂️</div>
          <div className="stat-content">
            <div className="stat-number">50</div>
            <div className="stat-label">Male Clients</div>
          </div>
        </div>
      </div>

      {/* Client Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h3 className="table-title">All Clients</h3>
          <div className="table-count">1 - 10 of 256</div>
        </div>

        <div className="admin-table">
          <div className="table-head">
            <div className="table-row head">
              <div className="table-cell checkbox-cell">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedClients.length === clients.length}
                />
              </div>
              <div className="table-cell name-header">
                <span className="table-header-text">👤 Name</span>
              </div>
              <div className="table-cell">
                <span className="table-header-text">💬 Message</span>
              </div>
              <div className="table-cell">
                <span className="table-header-text">📋 Questionnaire</span>
              </div>
              <div className="table-cell">
                <span className="table-header-text">🏋️ Workout Plan</span>
              </div>
              <div className="table-cell">
                <span className="table-header-text">📊 Progress</span>
              </div>
              <div className="table-cell">
                <span className="table-header-text">Action</span>
              </div>
            </div>
          </div>

          <div className="table-body">
            {clients.map((client) => (
              <div key={client.id} className="table-row">
                <div className="table-cell checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleSelectClient(client.id)}
                  />
                </div>
                <div className="table-cell client-cell">
                  <div className="client-info">
                    <div className="client-avatar">
                      <img src={client.avatar} alt={client.name} />
                    </div>
                    <div className="client-details">
                      <div className="client-name">{client.name}</div>
                      <div className="client-email">{client.email}</div>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <button className="message-btn">Send message</button>
                </div>
                <div className="table-cell">
                  <button 
                    className="view-btn outline"
                    onClick={() => handleViewQuestionnaire(client)}
                  >
                    View
                  </button>
                </div>
                <div className="table-cell">
                  {client.workoutPlan === 'Create' ? (
                    <button 
                      className="create-btn"
                      onClick={() => handleCreateWorkout(client)}
                    >
                      Create
                    </button>
                  ) : (
                    <span className="workout-plan-name">{client.workoutPlan}</span>
                  )}
                </div>
                <div className="table-cell progress-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${client.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{client.progress}%</span>
                </div>
                <div className="table-cell action-cell">
                  <span className="preview-edit">Preview / Edit</span>
                  <button className="trash-btn">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-icons">
            <button className="toolbar-btn">✈️</button>
            <button className="toolbar-btn">✋</button>
            <button className="toolbar-btn">💬</button>
            <button className="toolbar-btn ask-edit">Ask to edit</button>
            <button className="toolbar-btn">📊</button>
            <button className="toolbar-btn">📋</button>
            <button className="toolbar-btn">💻</button>
          </div>
        </div>
      </div>

      {/* Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={showQuestionnaireModal}
        onClose={closeQuestionnaireModal}
        clientName={selectedClient?.name}
      />

      {/* Create Workout Modal */}
      <CreateWorkoutModal
        isOpen={showCreateWorkoutModal}
        onClose={closeCreateWorkoutModal}
        clientName={selectedClient?.name}
      />
    </div>
  );
};

export default AdminDashboard;