package com.example.Alpha.Fitness.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "workout_plans")
public class WorkoutPlan {

    @Id
    private String _id;
    private String title;
    private String difficulty; // Beginner, Intermediate, Advanced, All Levels
    private String duration;
    private String focus; // Strength, Cardio, Flexibility, Full Body, etc.
    private String description;
    private List<Exercise> exercises;
    private String createdBy; // User ID

    // Constructors
    public WorkoutPlan() {}

    public WorkoutPlan(String title, String difficulty, String duration, String focus,
                       String description, List<Exercise> exercises, String createdBy) {
        this.title = title;
        this.difficulty = difficulty;
        this.duration = duration;
        this.focus = focus;
        this.description = description;
        this.exercises = exercises;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getFocus() {
        return focus;
    }

    public void setFocus(String focus) {
        this.focus = focus;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Exercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<Exercise> exercises) {
        this.exercises = exercises;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}