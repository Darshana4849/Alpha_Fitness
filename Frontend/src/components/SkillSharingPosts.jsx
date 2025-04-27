import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function SkillSharingPosts() {
    const [postId, setId] = useState('');
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [posts, setPosts] = useState([]);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [likedPosts, setLikedPosts] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        (async () => await Load())();
    }, []);

    async function Load() {
        setLoading(true);
        setError(null);
        try {
            const result = await axios.get("http://localhost:8081/api/v1/posts/getAll");
            console.log("Loaded posts data:", result.data);
            setPosts(result.data);
            
            // initialise liked posts state
            const likesState = {};
            result.data.forEach(post => {
                if (post.likedBy && post.likedBy.includes(localStorage.getItem('userId'))) {
                    likesState[post._id] = true;
                }
            });
            setLikedPosts(likesState);
        } catch (error) {
            console.error("Error loading posts:", error);
            setError("Failed to load posts. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.some(file => file.size > 10 * 1024 * 1024)) {
            alert("File size should be less than 10MB");
            return;
        }
        setFiles(selectedFiles);
        
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    async function save(event) {
        event.preventDefault();
        if (!title || !content || !author) {
            alert("Please fill all required fields");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('author', author);
        
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post(
                "http://localhost:8081/api/v1/posts/save-with-media", 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log("Post created successfully:", response.data);
            alert("Post created successfully!");
            resetForm();
            await Load();
        } catch (err) {
            console.error("Error creating post:", err);
            setError(err.response?.data?.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function editPost(post) {      //function decleare
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author);
        setId(post._id);
        setPreviewUrls(post.mediaUrls || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function deletePost(postId) {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        
        try {
            await axios.delete(`http://localhost:8081/api/v1/posts/delete/${postId}`);
            alert("Post deleted successfully");
            await Load();
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    }

    async function update(event) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await axios.put(`http://localhost:8081/api/v1/posts/edit/${postId}`, {
                postId: postId,
                title: title,
                content: content,
                author: author,
                mediaUrls: previewUrls
            });

            alert("Post updated successfully!");
            resetForm();
            await Load();
        } catch (err) {
            console.error("Error updating post:", err);
            setError(err.response?.data?.message || "Failed to update post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleLike = async (postId) => {
        try {
            // Toggle like status locally immediately for better UX
            setLikedPosts(prev => ({
                ...prev,
                [postId]: !prev[postId]
            }));
            
            // Send request to backend
            await axios.post(`http://localhost:8081/api/v1/posts/like/${postId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Refresh posts to get updated like count
            await Load();
        } catch (error) {
            console.error("Error liking post:", error);
            // Revert if there was an error
            setLikedPosts(prev => ({
                ...prev,
                [postId]: !prev[postId]
            }));
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const submitComment = async (postId) => {
        if (!commentInputs[postId]?.trim()) return;
        
        try {
            const response = await axios.post(
                `http://localhost:8081/api/v1/posts/comment/${postId}`, 
                { text: commentInputs[postId] },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            // Update comments locally
            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), response.data]
            }));
            
            // Clear input
            setCommentInputs(prev => ({
                ...prev,
                [postId]: ''
            }));
            
            // Refresh posts to get updated comment count
            await Load();
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const sharePost = (postId) => {
        const postUrl = `${window.location.origin}/posts/${postId}`;
        if (navigator.share) {
            navigator.share({
                title: 'Check out this fitness post!',
                text: 'I found this interesting fitness post you might like:',
                url: postUrl,
            })
            .catch(err => console.error('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(postUrl)
                .then(() => alert('Link copied to clipboard!'))
                .catch(err => console.error('Could not copy text: ', err));
        }
    };

    const formatNumber = (num) => {
        if (!num) return 0;
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    const removePreview = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        
        const newUrls = [...previewUrls];
        URL.revokeObjectURL(newUrls[index]);
        newUrls.splice(index, 1);
        setPreviewUrls(newUrls);
    };

    const resetForm = () => {
        setId("");
        setTitle("");
        setContent("");
        setAuthor("");
        setFiles([]);
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
    };

    return (
        <div style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "'Poppins', sans-serif"
        }}>
            <h1 style={{
                color: "#2c3e50",
                textAlign: "center",
                marginBottom: "30px",
                fontSize: "2.2rem",
                fontWeight: "700"
            }}>Fitness Community Posts</h1>
            
            <button 
                onClick={() => navigate(-1)}
                style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    marginBottom: "30px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    ":hover": {
                        backgroundColor: "#c0392b",
                        transform: "translateY(-2px)"
                    }
                }}
            >
                <span>←</span> Back to Home
            </button>

            {/* Create/Edit Post Form */}
            <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                marginBottom: "40px"
            }}>
                <h2 style={{ 
                    color: "#2c3e50",
                    fontSize: "1.6rem",
                    marginBottom: "25px",
                    fontWeight: "600"
                }}>
                    {postId ? "Edit Post" : "Create New Post"}
                </h2>
                
                {error && (
                    <div style={{
                        backgroundColor: "#fdecea",
                        color: "#d32f2f",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}
                
                <form>
                    <input type="text" hidden value={postId} onChange={(event) => setId(event.target.value)} />
                    
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ 
                            display: "block", 
                            marginBottom: "8px", 
                            fontWeight: "500",
                            color: "#34495e",
                            fontSize: "1rem"
                        }}>
                            Title <span style={{color: "#e74c3c"}}>*</span>
                        </label>
                        <input 
                            type="text" 
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "1rem",
                                transition: "border-color 0.3s ease"
                            }}
                            value={title} 
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Enter post title"
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ 
                            display: "block", 
                            marginBottom: "8px", 
                            fontWeight: "500",
                            color: "#34495e",
                            fontSize: "1rem"
                        }}>
                            Content <span style={{color: "#e74c3c"}}>*</span>
                        </label>
                        <textarea 
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                minHeight: "150px",
                                fontSize: "1rem",
                                transition: "border-color 0.3s ease",
                                resize: "vertical"
                            }}
                            value={content} 
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="Share your fitness tips, experiences, or questions..."
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ 
                            display: "block", 
                            marginBottom: "8px", 
                            fontWeight: "500",
                            color: "#34495e",
                            fontSize: "1rem"
                        }}>
                            Your Name <span style={{color: "#e74c3c"}}>*</span>
                        </label>
                        <input 
                            type="text" 
                            style={{
                                width: "100%",
                                padding: "12px 15px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                fontSize: "1rem",
                                transition: "border-color 0.3s ease"
                            }}
                            value={author} 
                            onChange={(event) => setAuthor(event.target.value)}
                            placeholder="Enter your name"
                            disabled={loading}
                        />
                    </div>
                    
                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ 
                            display: "block", 
                            marginBottom: "8px", 
                            fontWeight: "500",
                            color: "#34495e",
                            fontSize: "1rem"
                        }}>
                            Upload Images/Videos (Max 10MB each)
                        </label>
                        <div style={{
                            border: "2px dashed #ddd",
                            borderRadius: "8px",
                            padding: "25px",
                            textAlign: "center",
                            transition: "all 0.3s ease",
                            backgroundColor: "#f9f9f9"
                        }}>
                            <input 
                                type="file" 
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                                id="file-upload"
                                disabled={loading}
                            />
                            <label 
                                htmlFor="file-upload"
                                style={{
                                    display: "inline-block",
                                    cursor: "pointer",
                                    color: "#3498db",
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    backgroundColor: "rgba(52, 152, 219, 0.1)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                📁 Click to browse files
                            </label>
                            <p style={{
                                color: "#7f8c8d",
                                fontSize: "0.9rem",
                                marginTop: "15px"
                            }}>
                                Supports JPG, PNG, GIF, MP4
                            </p>
                        </div>
                        
                        {previewUrls.length > 0 && (
                            <div style={{ 
                                marginTop: "20px",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                gap: "15px"
                            }}>
                                {previewUrls.map((url, index) => (
                                    <div key={index} style={{ 
                                        position: "relative",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        aspectRatio: files[index]?.type?.startsWith('video/') ? "16/9" : "1",
                                        backgroundColor: "#f0f0f0",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        transition: "transform 0.3s ease"
                                    }}>
                                        {files[index]?.type?.startsWith('image/') ? (
                                            <LazyLoadImage
                                                src={url}
                                                alt={`Preview ${index}`}
                                                effect="blur"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <video
                                                src={url}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                                controls
                                            />
                                        )}
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removePreview(index);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                backgroundColor: "rgba(231, 76, 60, 0.9)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "28px",
                                                height: "28px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "16px",
                                                transition: "all 0.2s ease"
                                            }}
                                            disabled={loading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div style={{ 
                        display: "flex", 
                        gap: "15px",
                        justifyContent: postId ? "space-between" : "flex-end"
                    }}>
                        {postId && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                style={{
                                    backgroundColor: "#95a5a6",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 25px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    transition: "all 0.2s ease"
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}
                        <div style={{ display: "flex", gap: "15px" }}>
                            <button 
                                onClick={postId ? update : save}
                                style={{
                                    backgroundColor: postId ? "#3498db" : "#2ecc71",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 25px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    transition: "all 0.2s ease"
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span>Processing...</span>
                                ) : postId ? (
                                    <span>💾 Update Post</span>
                                ) : (
                                    <span>✨ Create Post</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Posts List */}
            <div>
                <h2 style={{ 
                    color: "#2c3e50",
                    fontSize: "1.8rem",
                    marginBottom: "25px",
                    fontWeight: "600"
                }}>
                    Community Discussions
                </h2>
                
                {loading && !postId ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px"
                    }}>
                        <div style={{
                            width: "50px",
                            height: "50px",
                            border: "5px solid #f3f3f3",
                            borderTop: "5px solid #3498db",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }}></div>
                        <p style={{ color: "#7f8c8d" }}>Loading community posts...</p>
                    </div>
                ) : error ? (
                    <div style={{
                        backgroundColor: "#fdecea",
                        color: "#d32f2f",
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "20px"
                    }}>
                        <p>{error}</p>
                        <button 
                            onClick={Load}
                            style={{
                                marginTop: "15px",
                                backgroundColor: "#e74c3c",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                        >
                            Retry
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        backgroundColor: "white",
                        padding: "40px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        textAlign: "center"
                    }}>
                        <p style={{ 
                            color: "#7f8c8d",
                            fontSize: "1.1rem",
                            marginBottom: "20px"
                        }}>
                            No posts yet. Be the first to share your fitness journey!
                        </p>
                        <button 
                            onClick={resetForm}
                            style={{
                                backgroundColor: "#2ecc71",
                                color: "white",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "1rem",
                                transition: "all 0.2s ease"
                            }}
                        >
                            Create Your First Post
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "30px" }}>
                        {posts.map((post) => (
                            <div key={post._id} style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "12px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                transition: "all 0.3s ease"
                            }}>
                                <div style={{ padding: "30px" }}>
                                    <h3 style={{
                                        color: "#2c3e50",
                                        marginBottom: "10px",
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        lineHeight: "1.3"
                                    }}>{post.title}</h3>
                                    <p style={{
                                        color: "#7f8c8d",
                                        marginBottom: "15px",
                                        fontStyle: "italic",
                                        fontSize: "0.95rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <span>Posted by:</span>
                                        <span style={{ 
                                            fontWeight: "500",
                                            color: "#3498db"
                                        }}>{post.author}</span>
                                        {post.createdAt && (
                                            <span style={{ 
                                                marginLeft: "auto",
                                                fontSize: "0.85rem",
                                                color: "#95a5a6"
                                            }}>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </p>
                                    <div style={{
                                        color: "#34495e",
                                        lineHeight: "1.7",
                                        marginBottom: "20px",
                                        fontSize: "1.05rem",
                                        whiteSpace: "pre-line"
                                    }}>
                                        {post.content}
                                    </div>
                                    
                                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                                        <div style={{ 
                                            margin: "0 -30px 25px -30px",
                                            padding: "0 30px"
                                        }}>
                                            <div style={{ 
                                                display: "grid",
                                                gridTemplateColumns: post.mediaUrls.length === 1 ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
                                                gap: "15px"
                                            }}>
                                                {post.mediaUrls.map((url, index) => (
                                                    <div key={index} style={{
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        position: "relative",
                                                        aspectRatio: post.mediaTypes?.[index]?.startsWith('video/') ? "16/9" : "1",
                                                        backgroundColor: "#f8f9fa",
                                                        transition: "transform 0.3s ease"
                                                    }}>
                                                        {!post.mediaTypes || post.mediaTypes[index]?.startsWith('image/') ? (
                                                            <LazyLoadImage
                                                                src={url}
                                                                alt={`Post media ${index + 1}`}
                                                                effect="blur"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                    cursor: "pointer"
                                                                }}
                                                                onClick={() => window.open(url, '_blank')}
                                                            />
                                                        ) : (
                                                            <video
                                                                src={url}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover"
                                                                }}
                                                                controls
                                                                playsInline
                                                            />
                                                        )}
                                                        <div style={{
                                                            position: "absolute",
                                                            bottom: "10px",
                                                            right: "10px",
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                            color: "white",
                                                            padding: "4px 10px",
                                                            borderRadius: "4px",
                                                            fontSize: "0.8rem",
                                                            fontWeight: "500"
                                                        }}>
                                                            {!post.mediaTypes || post.mediaTypes[index]?.startsWith('image/') ? "Image" : "Video"}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Social engagement section */}
                                    <div style={{
                                        borderTop: "1px solid #eee",
                                        paddingTop: "20px",
                                        marginTop: "20px"
                                    }}>
                                        {/* Like, Comment, Share buttons */}
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "15px"
                                        }}>
                                            <button 
                                                onClick={() => handleLike(post._id)}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                    color: likedPosts[post._id] ? "#e74c3c" : "#7f8c8d",
                                                    fontWeight: "500",
                                                    fontSize: "0.95rem",
                                                    transition: "all 0.2s ease",
                                                    padding: "8px 12px",
                                                    borderRadius: "6px"
                                                }}
                                            >
                                                {likedPosts[post._id] ? (
                                                    <span style={{ color: "#e74c3c" }}>❤️</span>
                                                ) : (
                                                    <span>🤍</span>
                                                )}
                                                Like ({formatNumber(post.likes || 0)})
                                            </button>
                                            
                                            <button 
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                    color: "#7f8c8d",
                                                    fontWeight: "500",
                                                    fontSize: "0.95rem",
                                                    transition: "all 0.2s ease",
                                                    padding: "8px 12px",
                                                    borderRadius: "6px"
                                                }}
                                            >
                                                <span>💬</span> Comment ({formatNumber(post.comments?.length || 0)})
                                            </button>
                                            
                                            <button 
                                                onClick={() => sharePost(post._id)}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    border: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    cursor: "pointer",
                                                    color: "#7f8c8d",
                                                    fontWeight: "500",
                                                    fontSize: "0.95rem",
                                                    transition: "all 0.2s ease",
                                                    padding: "8px 12px",
                                                    borderRadius: "6px"
                                                }}
                                            >
                                                <span>↗️</span> Share
                                            </button>
                                        </div>
                                        
                                        {/* Comments section */}
                                        <div style={{
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "8px",
                                            padding: "15px",
                                            marginBottom: "15px"
                                        }}>
                                            {/* Existing comments */}
                                            {(post.comments || []).map((comment, index) => (
                                                <div key={index} style={{
                                                    marginBottom: "12px",
                                                    paddingBottom: "12px",
                                                    borderBottom: index < ((post.comments?.length || 0) - 1) ? "1px solid #eee" : "none"
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        gap: "10px"
                                                    }}>
                                                        <div style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "50%",
                                                            backgroundColor: "#3498db",
                                                            color: "white",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "bold",
                                                            fontSize: "0.8rem",
                                                            flexShrink: "0"
                                                        }}>
                                                            {comment.author?.charAt(0)?.toUpperCase() || 'U'}
                                                        </div>
                                                        <div style={{ flex: "1" }}>
                                                            <div style={{
                                                                fontWeight: "600",
                                                                fontSize: "0.9rem",
                                                                marginBottom: "4px"
                                                            }}>
                                                                {comment.author || "Anonymous"}
                                                            </div>
                                                            <div style={{
                                                                fontSize: "0.9rem",
                                                                color: "#34495e"
                                                            }}>
                                                                {comment.text}
                                                            </div>
                                                            <div style={{
                                                                fontSize: "0.75rem",
                                                                color: "#95a5a6",
                                                                marginTop: "4px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "10px"
                                                            }}>
                                                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                                                <button style={{
                                                                    backgroundColor: "transparent",
                                                                    border: "none",
                                                                    color: "#3498db",
                                                                    cursor: "pointer",
                                                                    fontSize: "0.75rem",
                                                                    padding: "0"
                                                                }}>
                                                                    Reply
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Add comment input */}
                                            <div style={{
                                                display: "flex",
                                                gap: "10px",
                                                marginTop: "15px"
                                            }}>
                                                <input
                                                    type="text"
                                                    value={commentInputs[post._id] || ''}
                                                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                    placeholder="Write a comment..."
                                                    style={{
                                                        flex: "1",
                                                        padding: "10px 15px",
                                                        borderRadius: "20px",
                                                        border: "1px solid #ddd",
                                                        fontSize: "0.9rem",
                                                        outline: "none",
                                                        transition: "border-color 0.3s ease"
                                                    }}
                                                />
                                                <button
                                                    onClick={() => submitComment(post._id)}
                                                    style={{
                                                        backgroundColor: "#3498db",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "20px",
                                                        padding: "0 15px",
                                                        cursor: "pointer",
                                                        fontSize: "0.9rem",
                                                        fontWeight: "500",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Edit/Delete buttons (for post owner) */}
                                    <div style={{ 
                                        display: "flex", 
                                        gap: "15px",
                                        justifyContent: "flex-end"
                                    }}>
                                        <button 
                                            onClick={() => editPost(post)}
                                            style={{
                                                backgroundColor: "#f39c12",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontSize: "0.95rem",
                                                fontWeight: "500",
                                                transition: "all 0.2s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >
                                            <span>✏️</span> Edit
                                        </button>
                                        <button 
                                            onClick={() => deletePost(post._id)}
                                            style={{
                                                backgroundColor: "#e74c3c",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontSize: "0.95rem",
                                                fontWeight: "500",
                                                transition: "all 0.2s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px"
                                            }}
                                        >
                                            <span>🗑️</span> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SkillSharingPosts;