import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Here you would typically call your authentication API
    console.log('Login attempt with:', { email, password });
    // Simulate successful login
    navigate('/workoutPlans');
  };

  const handleOAuthLogin = (provider) => {
    // Redirect to OAuth provider
    console.log(`Redirecting to ${provider} OAuth`);
    // In a real app, this would redirect to your backend OAuth endpoint
    // window.location.href = `/auth/${provider}`;
    // For demo, we'll simulate success
    navigate('/workoutPlans');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
        >
          <FiArrowLeft style={styles.backIcon} />
        </button>
        
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Log in to access your fitness journey</p>

        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.rememberForgot}>
            <div style={styles.rememberMe}>
              <input type="checkbox" id="remember" style={styles.checkbox} />
              <label htmlFor="remember" style={styles.rememberLabel}>Remember me</label>
            </div>
            <Link to="/forgot-password" style={styles.forgotPassword}>Forgot password?</Link>
          </div>

          <button type="submit" style={styles.loginButton}>Log In</button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR CONTINUE WITH</span>
        </div>

        <div style={styles.socialButtons}>
          <button 
            onClick={() => handleOAuthLogin('google')} 
            style={styles.socialButton}
          >
            <FcGoogle style={styles.socialIcon} />
            Google
          </button>
          <button 
            onClick={() => handleOAuthLogin('facebook')} 
            style={{ ...styles.socialButton, backgroundColor: '#3b5998', color: 'white' }}
          >
            <FaFacebook style={styles.socialIcon} />
            Facebook
          </button>
          <button 
            onClick={() => handleOAuthLogin('github')} 
            style={{ ...styles.socialButton, backgroundColor: '#333', color: 'white' }}
          >
            <FaGithub style={styles.socialIcon} />
            GitHub
          </button>
        </div>

        <p style={styles.signupText}>
          Don't have an account? <Link to="/signup" style={styles.signupLink}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Poppins', sans-serif",
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '450px',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: '1.5rem',
    left: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7f8c8d',
  },
  backIcon: {
    fontSize: '1.5rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#3498db',
    },
  },
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    width: '1rem',
    height: '1rem',
  },
  rememberLabel: {
    color: '#2c3e50',
    fontSize: '0.9rem',
  },
  forgotPassword: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  loginButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    color: '#7f8c8d',
    '::before, ::after': {
      content: '""',
      flex: '1',
      borderBottom: '1px solid #ddd',
    },
  },
  dividerText: {
    padding: '0 1rem',
    fontSize: '0.8rem',
  },
  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginBottom: '1.5rem',
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.8rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  socialIcon: {
    fontSize: '1.2rem',
  },
  signupText: {
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  signupLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default Login;
