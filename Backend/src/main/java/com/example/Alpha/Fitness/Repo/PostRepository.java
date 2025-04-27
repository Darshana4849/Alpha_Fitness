package com.example.Alpha.Fitness.Repo;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Alpha.Fitness.Entity.Post;

public interface PostRepository extends MongoRepository<Post, String> {

}
