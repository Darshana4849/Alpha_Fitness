package com.example.Alpha.Fitness.Service;

import com.example.Alpha.Fitness.Entity.Post;
import com.example.Alpha.Fitness.Repo.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostServices {

    @Autowired
    private PostRepository postRepo;

    public Post saveOrUpdate(Post post) {
        return postRepo.save(post);
    }

    public Iterable<Post> listAll() {
        return postRepo.findAll();
    }

    public void deletePost(String id) {
        postRepo.deleteById(id);
    }

    public Post getPostById(String postId) {
        Optional<Post> post = postRepo.findById(postId);
        return post.orElse(null);
    }

}
