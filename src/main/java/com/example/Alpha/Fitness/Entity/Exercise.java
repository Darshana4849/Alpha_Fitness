package com.example.Alpha.Fitness.Entity;

public class Exercise {
    private String name;
    private String sets;
    private String reps;
    private String duration;

    // Constructors
    public Exercise() {}

    public Exercise(String name, String sets, String reps, String duration) {
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.duration = duration;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSets() {
        return sets;
    }

    public void setSets(String sets) {
        this.sets = sets;
    }

    public String getReps() {
        return reps;
    }

    public void setReps(String reps) {
        this.reps = reps;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}