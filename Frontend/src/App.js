import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SkillSharingPosts from './components/SkillSharingPosts';
import WorkoutPlans from './components/WorkoutPlans';
import CreateWorkoutPlan from './components/CreateWorkoutPlan';
import EditWorkoutPlan from './components/EditWorkoutPlan';
import WorkoutProgress from './components/WorkoutProgress'; // Import the new WorkoutProgress component
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/skillsharingposts" element={<SkillSharingPosts />} />
        
        {/* Workout Plan Routes */}
        <Route path="/workoutplans" element={<WorkoutPlans />} />
        <Route path="/workoutplans/create" element={<CreateWorkoutPlan />} />
        <Route path="/workoutplans/edit/:id" element={<EditWorkoutPlan />} />
        <Route path="/workout-progress/:id" element={<WorkoutProgress />} />
        
        {/* Legacy/Alternative Routes (for backward compatibility) */}
        <Route path="/CreateWorkoutPlan" element={<CreateWorkoutPlan />} />
        <Route path="/EditWorkoutPlan/:id" element={<EditWorkoutPlan />} />
        <Route path="/WorkoutProgress/:id" element={<WorkoutProgress />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;