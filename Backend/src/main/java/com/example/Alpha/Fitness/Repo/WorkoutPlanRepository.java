package com.example.Alpha.Fitness.Repo;

import com.example.Alpha.Fitness.Entity.WorkoutPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutPlanRepository extends MongoRepository<WorkoutPlan, String> {
    List<WorkoutPlan> findByDifficulty(String difficulty);
    List<WorkoutPlan> findByFocus(String focus);
    List<WorkoutPlan> findByDifficultyAndFocus(String difficulty, String focus);

    @Query("{'title': {$regex : ?0, $options: 'i'}}")
    List<WorkoutPlan> findByTitleContaining(String title);

    @Query("{$or: ["
            + "{'title': {$regex : ?0, $options: 'i'}}, "
            + "{'description': {$regex : ?0, $options: 'i'}}"
            + "]}")
    List<WorkoutPlan> searchByTitleOrDescription(String searchTerm);
}