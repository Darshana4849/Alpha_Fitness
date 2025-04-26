package com.example.Alpha.Fitness.Controller;

import com.example.Alpha.Fitness.Entity.WorkoutPlan;
import com.example.Alpha.Fitness.Service.WorkoutPlanServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/workout-plans")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanServices workoutPlanServices;

    @PostMapping("/save")
    public ResponseEntity<WorkoutPlan> saveWorkoutPlan(@RequestBody WorkoutPlan workoutPlan) {
        WorkoutPlan savedPlan = workoutPlanServices.saveOrUpdate(workoutPlan);
        return ResponseEntity.ok(savedPlan);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<WorkoutPlan>> getAllWorkoutPlans() {
        return ResponseEntity.ok(workoutPlanServices.listAll());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<WorkoutPlan>> filterWorkoutPlans(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String focus) {
        return ResponseEntity.ok(workoutPlanServices.filterWorkoutPlans(difficulty, focus));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<WorkoutPlan> updateWorkoutPlan(
            @PathVariable String id,
            @RequestBody WorkoutPlan workoutPlan) {
        // Verify the workout exists before updating
        if (workoutPlanServices.getWorkoutPlanById(id) == null) {
            return ResponseEntity.notFound().build();
        }

        workoutPlan.set_id(id);
        WorkoutPlan updatedPlan = workoutPlanServices.saveOrUpdate(workoutPlan);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable String id) {
        workoutPlanServices.deleteWorkoutPlan(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<WorkoutPlan> getWorkoutPlanById(@PathVariable String id) {
        WorkoutPlan plan = workoutPlanServices.getWorkoutPlanById(id);
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(plan);
    }
}