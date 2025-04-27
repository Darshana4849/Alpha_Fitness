package com.example.Alpha.Fitness.Service;

import com.example.Alpha.Fitness.Entity.WorkoutPlan;
import com.example.Alpha.Fitness.Repo.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutPlanServices {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public WorkoutPlan saveOrUpdate(WorkoutPlan workoutPlan) {
        return workoutPlanRepository.save(workoutPlan);
    }

    public List<WorkoutPlan> listAll() {
        return workoutPlanRepository.findAll();
    }

    public List<WorkoutPlan> filterWorkoutPlans(String difficulty, String focus) {
        if (difficulty != null && focus != null) {
            return workoutPlanRepository.findByDifficultyAndFocus(difficulty, focus);
        } else if (difficulty != null) {
            return workoutPlanRepository.findByDifficulty(difficulty);
        } else if (focus != null) {
            return workoutPlanRepository.findByFocus(focus);
        }
        return workoutPlanRepository.findAll();
    }

    public void deleteWorkoutPlan(String id) {
        workoutPlanRepository.deleteById(id);
    }

    public WorkoutPlan getWorkoutPlanById(String id) {
        return workoutPlanRepository.findById(id).orElse(null);
    }

    public List<WorkoutPlan> searchWorkoutPlans(String searchTerm) {
        return workoutPlanRepository.searchByTitleOrDescription(searchTerm);
    }

    public boolean existsById(String id) {
        return workoutPlanRepository.existsById(id);
    }
}