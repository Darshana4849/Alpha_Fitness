package com.example.Alpha.Fitness.Controller;

import com.example.Alpha.Fitness.Entity.Post;
import com.example.Alpha.Fitness.Service.PostServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/v1/posts")
public class PostController {

    @Autowired
    private PostServices postServices;

    private static final String UPLOAD_DIR = "uploads";

    @PostMapping(value = "/save-with-media")
    public ResponseEntity<?> savePostWithMedia(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("author") String author,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {

        Post post = new Post(title, content, author);
        
        if (files != null && files.length > 0) {
            List<String> mediaUrls = new ArrayList<>();
            List<String> mediaTypes = new ArrayList<>();

            try {
                // Create upload directory if it doesn't exist
                Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                for (MultipartFile file : files) {
                    // Generate unique filename
                    String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(filename);
                    
                    // Save file
                    Files.copy(file.getInputStream(), filePath);
                    
                    // Store complete accessible URL
                    String fileUrl = "http://localhost:8081/uploads/" + filename;
                    mediaUrls.add(fileUrl);
                    mediaTypes.add(file.getContentType());
                }

                post.setMediaUrls(mediaUrls);
                post.setMediaTypes(mediaTypes);

            } catch (IOException e) {
                return ResponseEntity.badRequest().body("Failed to upload files: " + e.getMessage());
            }
        }

        postServices.saveOrUpdate(post);
        return ResponseEntity.ok(post);
    }

    @GetMapping(value = "/getAll")
    public Iterable<Post> getAllPosts() {
        return postServices.listAll();
    }

    @PutMapping(value = "/edit/{id}")
    public Post updatePost(@RequestBody Post post, @PathVariable(name = "id") String _id) {
        post.set_id(_id);
        postServices.saveOrUpdate(post);
        return post;
    }

    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable("id") String _id) {
        postServices.deletePost(_id);
    }

    @GetMapping("/search/{id}")
    public Post getPostById(@PathVariable(name = "id") String postId) {
        return postServices.getPostById(postId);
    }
}