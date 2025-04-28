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

    async function editPost(post) {
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
            maxWidth: "935px", // Instagram's desktop width
            margin: "0 auto",
            padding: "20px 0", // Reduced side padding
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
                                borderRadius: "8px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                border: "1px solid #dbdbdb" // Instagram-like border
                            }}>
                                {/* Post header */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "14px 16px",
                                    borderBottom: "1px solid #efefef"
                                }}>
                                    <div style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: "#f0f0f0",
                                        marginRight: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: "bold",
                                        color: "#262626"
                                    }}>
                                        {post.author?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}>
                                        {post.author || "Anonymous"}
                                    </div>
                                    <button 
                                        onClick={() => deletePost(post._id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "8px",
                                            fontSize: "16px",
                                            color: "#262626"
                                        }}
                                    >
                                        ⋯
                                    </button>
                                </div>
                                
                                {/* Image container */}
                                {post.mediaUrls && post.mediaUrls.length > 0 && (
                                    <div style={{
                                        width: "100%",
                                        aspectRatio: "1/1", // Square aspect ratio like Instagram
                                        backgroundColor: "#fafafa",
                                        position: "relative",
                                        overflow: "hidden"
                                    }}>
                                        {post.mediaUrls.length === 1 ? (
                                            <div style={{
                                                width: "100%",
                                                height: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                {!post.mediaTypes || post.mediaTypes[0]?.startsWith('image/') ? (
                                                    <LazyLoadImage
                                                        src={post.mediaUrls[0]}
                                                        alt={`Post media`}
                                                        effect="blur"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => window.open(post.mediaUrls[0], '_blank')}
                                                    />
                                                ) : (
                                                    <video
                                                        src={post.mediaUrls[0]}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                        controls
                                                        playsInline
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(2, 1fr)",
                                                width: "100%",
                                                height: "100%",
                                                gap: "2px"
                                            }}>
                                                {post.mediaUrls.slice(0, 4).map((url, index) => (
                                                    <div key={index} style={{
                                                        position: "relative",
                                                        overflow: "hidden"
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
                                                        {post.mediaUrls.length > 4 && index === 3 && (
                                                            <div style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                backgroundColor: "rgba(0,0,0,0.5)",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                color: "white",
                                                                fontSize: "1.5rem",
                                                                fontWeight: "bold"
                                                            }}>
                                                                +{post.mediaUrls.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Action buttons (Like, Comment, Share) */}
                                <div style={{
                                    padding: "8px 16px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "8px"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            gap: "16px"
                                        }}>
                                            <button 
                                                onClick={() => handleLike(post._id)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: "8px",
                                                    fontSize: "24px",
                                                    color: likedPosts[post._id] ? "#ed4956" : "#262626"
                                                }}
                                            >
                                                {likedPosts[post._id] ? "❤️" : "🤍"}
                                            </button>
                                            <button 
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: "8px",
                                                    fontSize: "24px",
                                                    color: "#262626"
                                                }}
                                            >
                                                💬
                                            </button>
                                            <button 
                                                onClick={() => sharePost(post._id)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: "8px",
                                                    fontSize: "24px",
                                                    color: "#262626"
                                                }}
                                            >
                                                ↗️
                                            </button>
                                        </div>
                                        <button 
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: "8px",
                                                fontSize: "24px",
                                                color: "#262626"
                                            }}
                                        >
                                            ⭐
                                        </button>
                                    </div>
                                    
                                    {/* Likes count */}
                                    <div style={{
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        marginBottom: "8px"
                                    }}>
                                        {formatNumber(post.likes || 0)} likes
                                    </div>
                                    
                                    {/* Post content */}
                                    <div style={{
                                        fontSize: "14px",
                                        marginBottom: "8px",
                                        lineHeight: "1.5"
                                    }}>
                                        <span style={{
                                            fontWeight: "600",
                                            marginRight: "4px"
                                        }}>{post.author || "Anonymous"}</span>
                                        {post.content}
                                    </div>
                                    
                                    {/* View all comments */}
                                    {(post.comments?.length || 0) > 0 && (
                                        <button 
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#8e8e8e",
                                                fontSize: "14px",
                                                cursor: "pointer",
                                                padding: 0,
                                                marginBottom: "8px"
                                            }}
                                        >
                                            View all {post.comments.length} comments
                                        </button>
                                    )}
                                    
                                    {/* Timestamp */}
                                    <div style={{
                                        color: "#8e8e8e",
                                        fontSize: "10px",
                                        textTransform: "uppercase",
                                        marginBottom: "8px"
                                    }}>
                                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    
                                    {/* Add comment */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        borderTop: "1px solid #efefef",
                                        paddingTop: "12px"
                                    }}>
                                        <input
                                            type="text"
                                            value={commentInputs[post._id] || ''}
                                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                            placeholder="Add a comment..."
                                            style={{
                                                flex: 1,
                                                border: "none",
                                                outline: "none",
                                                fontSize: "14px",
                                                padding: "4px 0"
                                            }}
                                        />
                                        <button
                                            onClick={() => submitComment(post._id)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#0095f6",
                                                fontWeight: "600",
                                                fontSize: "14px",
                                                cursor: "pointer",
                                                opacity: commentInputs[post._id]?.trim() ? 1 : 0.5,
                                                pointerEvents: commentInputs[post._id]?.trim() ? "auto" : "none"
                                            }}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Edit button (for post owner) */}
                                <div style={{ 
                                    padding: "0 16px 16px",
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}>
                                    <button 
                                        onClick={() => editPost(post)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "1px solid #dbdbdb",
                                            color: "#262626",
                                            padding: "6px 12px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        Edit Post
                                    </button>
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