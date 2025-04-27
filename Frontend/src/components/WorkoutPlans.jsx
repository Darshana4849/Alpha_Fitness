import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiFilter, FiClock, FiActivity, FiEdit, FiTrash2 } from 'react-icons/fi';

const WorkoutPlans = () => {
  const navigate = useNavigate();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  async function loadWorkoutPlans() {
    try {
      const result = await axios.get("http://localhost:8081/api/v1/workout-plans/getAll");
      setWorkoutPlans(result.data);
    } catch (error) {
      console.error("Error loading workout plans:", error);
    }
  }

  // Delete workouts plan 
  async function deleteWorkoutPlan(workoutId) {
    if (window.confirm("Are you sure you want to delete this workout plan?")) {
      try {
        await axios.delete(`http://localhost:8081/api/v1/workout-plans/delete/${workoutId}`);
        alert("Workout plan deleted successfully");
        loadWorkoutPlans();
      } catch (error) {
        alert("Failed to delete workout plan");
        console.error(error);
      }
    }
  }

  // Filter workouts
  const filteredWorkouts = activeFilter === 'all' 
    ? workoutPlans 
    : workoutPlans.filter(workout => 
        workout.difficulty === activeFilter || 
        workout.focus.toLowerCase() === activeFilter.toLowerCase()
      );

  // Difficulty badge color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return { bg: '#d4edda', text: '#155724' };
      case 'Intermediate': return { bg: '#fff3cd', text: '#856404' };
      case 'Advanced': return { bg: '#f8d7da', text: '#721c24' };
      default: return { bg: '#e2e3e5', text: '#383d41' };
    }
  };

  // Start workout plan
  const startWorkoutPlan = (workoutId) => {
    navigate(`/workout-progress/${workoutId}`);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header style */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',      //justify content
        alignItems: 'center',
        marginBottom: '30px',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e74c3c',  //background colour
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <FiArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>
        <h1 style={{
          color: '#2c3e50',
          margin: '0',
          fontSize: '28px',
          fontWeight: '700',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          Workout Plans
        </h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/CreateWorkoutPlan')}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '8px 15px',     //pading
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <FiPlus style={{ marginRight: '8px' }} />
            Create Plan
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <FiFilter style={{ marginRight: '8px' }} />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <button 
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'all' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'all' ? 'white' : '#2c3e50'
            }}
          >
            All Plans
          </button>
          <button 
            onClick={() => setActiveFilter('Beginner')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Beginner' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Beginner' ? 'white' : '#2c3e50'
            }}
          >
            Beginner
          </button>
          <button 
            onClick={() => setActiveFilter('Intermediate')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Intermediate' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Intermediate' ? 'white' : '#2c3e50'
            }}
          >
            Intermediate
          </button>
          <button 
            onClick={() => setActiveFilter('Advanced')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Advanced' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Advanced' ? 'white' : '#2c3e50'
            }}
          >
            Advanced
          </button>
          <button 
            onClick={() => setActiveFilter('Strength')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Strength' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Strength' ? 'white' : '#2c3e50'
            }}
          >
            Strength
          </button>
          <button 
            onClick={() => setActiveFilter('Cardio')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Cardio' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Cardio' ? 'white' : '#2c3e50'
            }}
          >
            Cardio
          </button>
          <button 
            onClick={() => setActiveFilter('Flexibility')}
            style={{
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              fontWeight: '500',
              backgroundColor: activeFilter === 'Flexibility' ? '#e74c3c' : '#f8f9fa',
              color: activeFilter === 'Flexibility' ? 'white' : '#2c3e50'
            }}
          >
            Flexibility
          </button>
        </div>
      )}

      {/* Workout Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {filteredWorkouts.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
              {workoutPlans.length === 0 
                ? 'No workout plans created yet. Create your first plan!' 
                : 'No workout plans match the selected filter.'}
            </p>
            <button 
              onClick={() => navigate('/createworkoutplan')}
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Create Workout Plan
            </button>
          </div>
        ) : (
          filteredWorkouts.map((workout) => (
            <div key={workout._id} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <div style={{ 
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #eee'
              }}>
                <h3 style={{ 
                  color: '#2c3e50', 
                  margin: '0 0 10px 0', 
                  fontSize: '20px'
                }}>
                  {workout.title}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px'
                }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: getDifficultyColor(workout.difficulty).bg,
                    color: getDifficultyColor(workout.difficulty).text
                  }}>
                    {workout.difficulty}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    <FiClock style={{ marginRight: '5px' }} />
                    {workout.duration}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#7f8c8d',
                    fontSize: '14px'
                  }}>
                    <FiActivity style={{ marginRight: '5px' }} />
                    {workout.focus}
                  </span>
                </div>
              </div>
              
              <p style={{ 
                color: '#34495e', 
                lineHeight: '1.6', 
                marginBottom: '20px'
              }}>
                {workout.description}
              </p>
              
              <div style={{ 
                flexGrow: '1',
                marginBottom: '20px'
              }}>
                <h4 style={{ 
                  color: '#2c3e50', 
                  fontSize: '16px', 
                  marginBottom: '10px'
                }}>
                  Exercises:
                </h4>
                <ul style={{ 
                  listStyle: 'none',
                  padding: '0',
                  margin: '0'
                }}>
                  {workout.exercises.map((exercise, index) => (
                    <li key={index} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #f1f1f1'
                    }}>
                      <span style={{ 
                        color: '#2c3e50', 
                        fontWeight: '500'
                      }}>
                        {exercise.name}
                      </span>
                      <span style={{ 
                        color: '#7f8c8d', 
                        fontSize: '14px'
                      }}>
                        {exercise.sets && `${exercise.sets} sets × `}
                        {exercise.reps || exercise.duration}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button 
                  onClick={() => navigate(`/EditWorkoutPlan/${workout._id}`)}
                  style={{
                    backgroundColor: '#f39c12',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiEdit style={{ marginRight: '5px' }} />
                  Edit
                </button>
                <button 
                  onClick={() => deleteWorkoutPlan(workout._id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FiTrash2 style={{ marginRight: '5px' }} />
                  Delete
                </button>
                <button 
                  onClick={() => startWorkoutPlan(workout._id)}
                  style={{
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Start This Plan
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;