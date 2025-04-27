import axios from 'axios'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';

const CreateWorkoutPlan = () => {
  const navigate = useNavigate();
  const [workoutId, setWorkoutId] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Beginner',
    duration: '',
    focus: 'Strength',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', duration: '' }]
  });
  
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle exercise input changes
  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [name]: value
    };
    setFormData(prev => ({
      ...prev,
      exercises: updatedExercises
    }));
  };
  
  // Add new exercise field
  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: '', reps: '', duration: '' }]
    }));
  };
  
  // Remove exercise field
  const removeExercise = (index) => {
    if (formData.exercises.length > 1) {
      const updatedExercises = [...formData.exercises];
      updatedExercises.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        exercises: updatedExercises
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    formData.exercises.forEach((exercise, index) => {
      if (!exercise.name.trim()) {
        newErrors[`exerciseName${index}`] = 'Exercise name is required';
      }
      if (!exercise.sets && !exercise.duration) {
        newErrors[`exerciseDetails${index}`] = 'Either sets/reps or duration is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Save workout plan
  async function saveWorkoutPlan(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await axios.post("http://localhost:8081/api/v1/workout-plans/save", formData);
      alert("Workout plan created successfully!");
      navigate('/workoutplans'); // Redirect to workout plans page
    } catch (err) {
      alert("Failed to create workout plan");
      console.error(err);
    }
  }

  // Update workout plan
  async function updateWorkoutPlan(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await axios.put(`http://localhost:8089/api/v1/workout-plans/edit/${workoutId}`, formData);
      alert("Workout plan updated successfully!");
      navigate('/workout-plans'); // Redirect to workout plans page
    } catch (err) {
      alert("Failed to update workout plan");
      console.error(err);
    }
  }

  // Reset form
  function resetForm() {
    setFormData({
      title: '',
      difficulty: 'Beginner',
      duration: '',
      focus: 'Strength',
      description: '',
      exercises: [{ name: '', sets: '', reps: '', duration: '' }]
    });
    setWorkoutId('');
    setErrors({});
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          <FiArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>
        <h1 style={{
          color: '#2c3e50',
          margin: '0',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {workoutId ? 'Edit Workout Plan' : 'Create New Workout Plan'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>
      
      {/* Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={workoutId ? updateWorkoutPlan : saveWorkoutPlan}>
          {/* Basic Information */}
          <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '20px' }}>Basic Information</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                Plan Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: errors.title ? '1px solid #e74c3c' : '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="e.g., Beginner Full Body Workout"
              />
              {errors.title && <span style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                {errors.title}
              </span>}
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                  Difficulty Level*
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
              
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                  Duration*
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    border: errors.duration ? '1px solid #e74c3c' : '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="e.g., 4 weeks"
                />
                {errors.duration && <span style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                  {errors.duration}
                </span>}
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                Focus Area*
              </label>
              <select
                name="focus"
                value={formData.focus}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              >
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibility">Flexibility</option>
                <option value="Full Body">Full Body</option>
                <option value="Upper Body">Upper Body</option>
                <option value="Lower Body">Lower Body</option>
                <option value="Core">Core</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: errors.description ? '1px solid #e74c3c' : '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                placeholder="Describe the workout plan, its benefits, and who it's for..."
                rows="4"
              />
              {errors.description && <span style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                {errors.description}
              </span>}
            </div>
          </div>
          
          {/* Exercises */}
          <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ color: '#2c3e50', fontSize: '20px', marginBottom: '20px' }}>Exercises</h2>
            
            {formData.exercises.map((exercise, index) => (
              <div key={index} style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ color: '#2c3e50', margin: '0', fontSize: '16px' }}>Exercise {index + 1}</h3>
                  {formData.exercises.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeExercise(index)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                    >
                      <FiTrash2 style={{ fontSize: '18px' }} />
                    </button>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                    Exercise Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, e)}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      border: errors[`exerciseName${index}`] ? '1px solid #e74c3c' : '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                    placeholder="e.g., Squats"
                  />
                  {errors[`exerciseName${index}`] && (
                    <span style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                      {errors[`exerciseName${index}`]}
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                      Sets
                    </label>
                    <input
                      type="number"
                      name="sets"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, e)}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '16px'
                      }}
                      placeholder="3"
                      min="1"
                    />
                  </div>
                  
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                      Reps
                    </label>
                    <input
                      type="text"
                      name="reps"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, e)}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '16px'
                      }}
                      placeholder="8-12"
                    />
                  </div>
                  
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#2c3e50', fontWeight: '500' }}>
                      OR Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={exercise.duration}
                      onChange={(e) => handleExerciseChange(index, e)}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        border: errors[`exerciseDetails${index}`] ? '1px solid #e74c3c' : '1px solid #ddd',
                        borderRadius: '5px',
                        fontSize: '16px'
                      }}
                      placeholder="e.g., 30 sec"
                    />
                  </div>
                </div>
                
                {errors[`exerciseDetails${index}`] && (
                  <span style={{ display: 'block', color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>
                    {errors[`exerciseDetails${index}`]}
                  </span>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={addExercise}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                border: '1px dashed #ddd',
                color: '#2c3e50',
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '5px',
                width: '100%',
                fontWeight: '500',
                marginBottom: '20px'
              }}
            >
              <FiPlus style={{ marginRight: '8px', fontSize: '18px' }} />
              Add Another Exercise
            </button>
          </div>
          
          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              type="submit"
              style={{
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                flex: '1'
              }}
            >
              {workoutId ? 'Update Workout Plan' : 'Create Workout Plan'}
            </button>
            
            {workoutId && (
              <button 
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkoutPlan;