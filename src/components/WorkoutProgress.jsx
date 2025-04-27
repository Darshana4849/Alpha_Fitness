import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiClock, FiPause, FiPlay, FiSkipForward, FiArrowLeft } from 'react-icons/fi';

const WorkoutProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [exerciseProgress, setExerciseProgress] = useState(0); // For current exercise progress

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/workout-plans/get/${id}`);
        setWorkout(response.data);
        setWorkoutStartTime(new Date());
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        navigate('/workoutplans');
      }
    };

    fetchWorkoutPlan();
  }, [id, navigate]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        // Update exercise progress percentage
        if (workout?.exercises[currentExerciseIndex]?.duration) {
          const totalDuration = workout.exercises[currentExerciseIndex].duration;
          setExerciseProgress(((totalDuration - timeRemaining + 1) / totalDuration) * 100);
        }
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      handleExerciseComplete();
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining, currentExerciseIndex, workout]);

  useEffect(() => {
    // Update workout duration every second for more accurate tracking
    const durationInterval = setInterval(() => {
      if (workoutStartTime) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - workoutStartTime) / 1000);
        setWorkoutDuration(diffInSeconds);
      }
    }, 1000);

    return () => clearInterval(durationInterval);
  }, [workoutStartTime]);

  const startExerciseTimer = (duration) => {
    setTimeRemaining(duration);
    setExerciseProgress(0);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleExerciseComplete = () => {
    setIsTimerRunning(false);
    const currentExercise = workout.exercises[currentExerciseIndex];
    setCompletedExercises([...completedExercises, currentExercise.name]);
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setExerciseProgress(0);
    } else {
      // Workout complete
      alert('Workout completed! Great job!');
      navigate('/workoutplans');
    }
  };

  const skipToNextExercise = () => {
    setIsTimerRunning(false);
    setExerciseProgress(0);
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      handleExerciseComplete();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWorkoutDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (!workout) {
    return <div>Loading workout plan...</div>;
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isDurationBased = currentExercise.duration;
  const workoutProgressPercentage = ((currentExerciseIndex) / workout.exercises.length) * 100;
  const totalExercises = workout.exercises.length;

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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <button 
          onClick={() => navigate('/workoutplans')}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <FiArrowLeft style={{ marginRight: '8px' }} />
          Exit Workout
        </button>
        <h1 style={{
          color: '#2c3e50',
          margin: '0',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          {workout.title}
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#7f8c8d',
          fontSize: '14px'
        }}>
          <FiClock style={{ marginRight: '5px' }} />
          {formatWorkoutDuration(workoutDuration)}
        </div>
      </div>

      {/* Workout Completion Progress */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}>
          <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Workout Progress</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
            {Math.round(workoutProgressPercentage)}% ({currentExerciseIndex}/{totalExercises})
          </span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '10px',
          height: '10px',
          marginBottom: '15px'
        }}>
          <div style={{
            width: `${workoutProgressPercentage}%`,
            backgroundColor: '#2ecc71',
            borderRadius: '10px',
            height: '100%',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Current Exercise Progress */}
      {isDurationBased && (
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Current Exercise Progress</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
              {Math.round(exerciseProgress)}% ({formatTime(currentExercise.duration - timeRemaining)}/{formatTime(currentExercise.duration)})
            </span>
          </div>
          <div style={{
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            height: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              width: `${exerciseProgress}%`,
              backgroundColor: '#3498db',
              borderRadius: '10px',
              height: '100%',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {/* Current Exercise */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#2c3e50',
          margin: '0 0 15px 0',
          fontSize: '22px'
        }}>
          {currentExercise.name}
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {currentExercise.sets && (
            <div style={{
              backgroundColor: '#f1f1f1',
              padding: '10px 20px',
              borderRadius: '5px'
            }}>
              <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Sets</div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>{currentExercise.sets}</div>
            </div>
          )}
          
          {currentExercise.reps ? (
            <div style={{
              backgroundColor: '#f1f1f1',
              padding: '10px 20px',
              borderRadius: '5px'
            }}>
              <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Reps</div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>{currentExercise.reps}</div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f1f1f1',
              padding: '10px 20px',
              borderRadius: '5px'
            }}>
              <div style={{ color: '#7f8c8d', fontSize: '14px' }}>Duration</div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>{formatTime(currentExercise.duration)}</div>
            </div>
          )}
        </div>

        {isDurationBased && (
          <div style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#2c3e50',
            margin: '20px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {formatTime(timeRemaining || currentExercise.duration)}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginTop: '25px'
        }}>
          {isDurationBased && (
            <button 
              onClick={toggleTimer}
              style={{
                backgroundColor: isTimerRunning ? '#f39c12' : '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '12px 25px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isTimerRunning ? (
                <>
                  <FiPause /> Pause
                </>
              ) : (
                <>
                  <FiPlay /> Start
                </>
              )}
            </button>
          )}

          <button 
            onClick={handleExerciseComplete}
            style={{
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiCheck /> Complete
          </button>

          <button 
            onClick={skipToNextExercise}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiSkipForward /> Skip
          </button>
        </div>
      </div>

      {/* Exercise List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          color: '#2c3e50',
          margin: '0 0 15px 0',
          fontSize: '18px'
        }}>
          Workout Exercises
        </h3>
        
        <ul style={{
          listStyle: 'none',
          padding: '0',
          margin: '0'
        }}>
          {workout.exercises.map((exercise, index) => (
            <li 
              key={index} 
              style={{
                padding: '12px 0',
                borderBottom: '1px solid #f1f1f1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: index === currentExerciseIndex ? '#f8f9fa' : 'transparent',
                color: index < currentExerciseIndex ? '#95a5a6' : '#2c3e50'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {index < currentExerciseIndex ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#2ecc71',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                ) : (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #bdc3c7',
                    borderRadius: '50%',
                    marginRight: '10px',
                    backgroundColor: index === currentExerciseIndex ? '#3498db' : 'transparent'
                  }}></div>
                )}
                {exercise.name}
              </div>
              <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
                {exercise.sets && `${exercise.sets} sets × `}
                {exercise.reps || `${exercise.duration} sec`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutProgress;