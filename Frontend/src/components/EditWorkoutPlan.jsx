import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const EditWorkoutPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    focus: 'Strength',
    duration: '',
    exercises: []
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    duration: ''
  });

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/workout-plans/get/${id}`);
        setWorkout(response.data);
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        alert("Failed to load workout plan");
      }
    };
    fetchWorkoutPlan();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExercises = [...workout.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [name]: value };
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const addExercise = () => {
    if (newExercise.name) {
      setWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, newExercise]
      }));
      setNewExercise({ name: '', sets: '', reps: '', duration: '' });
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = workout.exercises.filter((_, i) => i !== index);
    setWorkout(prev => ({ ...prev, exercises: updatedExercises }));
  };

  const updateWorkoutPlan = async () => {
    try {
      await axios.put(`http://localhost:8081/api/v1/workout-plans/update/${id}`, workout);
      alert("Workout plan updated successfully!");
      navigate('/workoutplans');
    } catch (error) {
      console.error("Error updating workout plan:", error);
      alert("Failed to update workout plan");
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ color: '#2c3e50', margin: '0' }}>Edit Workout Plan</h1>
        <button 
          onClick={() => navigate('/workoutplans')}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <FiX style={{ marginRight: '5px' }} /> Cancel
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
          <input
            type="text"
            name="title"
            value={workout.title}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
          <textarea
            name="description"
            value={workout.description}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px',
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Difficulty</label>
            <select
              name="difficulty"
              value={workout.difficulty}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Focus</label>
            <select
              name="focus"
              value={workout.focus}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <option value="Strength">Strength</option>
              <option value="Cardio">Cardio</option>
              <option value="Flexibility">Flexibility</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={workout.duration}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '20px' }}>Exercises</h2>
        
        {workout.exercises.map((exercise, index) => (
          <div key={index} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '15px',
            alignItems: 'center',
            marginBottom: '15px',
            paddingBottom: '15px',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Name</label>
              <input
                type="text"
                name="name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(e, index)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Sets</label>
              <input
                type="number"
                name="sets"
                value={exercise.sets}
                onChange={(e) => handleExerciseChange(e, index)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                {workout.focus === 'Cardio' ? 'Duration' : 'Reps'}
              </label>
              <input
                type={workout.focus === 'Cardio' ? 'text' : 'number'}
                name={workout.focus === 'Cardio' ? 'duration' : 'reps'}
                value={workout.focus === 'Cardio' ? exercise.duration : exercise.reps}
                onChange={(e) => handleExerciseChange(e, index)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            
            <button 
              onClick={() => removeExercise(index)}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '5px',
                cursor: 'pointer',
                height: '36px',
                alignSelf: 'flex-end'
              }}
            >
              <FiTrash2 />
            </button>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', marginTop: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>New Exercise</label>
            <input
              type="text"
              name="name"
              value={newExercise.name}
              onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
              placeholder="Exercise name"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Sets</label>
            <input
              type="number"
              name="sets"
              value={newExercise.sets}
              onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
              placeholder="3"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              {workout.focus === 'Cardio' ? 'Duration' : 'Reps'}
            </label>
            <input
              type={workout.focus === 'Cardio' ? 'text' : 'number'}
              name={workout.focus === 'Cardio' ? 'duration' : 'reps'}
              value={workout.focus === 'Cardio' ? newExercise.duration : newExercise.reps}
              onChange={(e) => setNewExercise({
                ...newExercise,
                [workout.focus === 'Cardio' ? 'duration' : 'reps']: e.target.value
              })}
              placeholder={workout.focus === 'Cardio' ? '5 min' : '12'}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <button 
            onClick={addExercise}
            style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '5px',
              cursor: 'pointer',
              height: '36px',
              alignSelf: 'flex-end'
            }}
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <button 
        onClick={updateWorkoutPlan}
        style={{
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          padding: '12px 25px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto'
        }}
      >
        <FiSave style={{ marginRight: '8px' }} /> Save Changes
      </button>
    </div>
  );
};

export default EditWorkoutPlan;