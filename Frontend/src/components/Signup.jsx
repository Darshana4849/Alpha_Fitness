import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Here you would call your signup API
    console.log('Signup attempt with:', formData);
    // Simulate successful signup
    navigate('/workoutPlans');
  };

  const handleOAuthSignup = (provider) => {
    console.log(`Redirecting to ${provider} OAuth`);
    // In a real app: window.location.href = `/auth/${provider}`;
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
        
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join FitPro to start your fitness journey</p>

        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.terms}>
            <input type="checkbox" id="terms" style={styles.checkbox} required />
            <label htmlFor="terms" style={styles.termsLabel}>
              I agree to the <Link to="/terms" style={styles.termsLink}>Terms of Service</Link> and <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" style={styles.signupButton}>Create Account</button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR SIGN UP WITH</span>
        </div>

        <div style={styles.socialButtons}>
          <button 
            onClick={() => handleOAuthSignup('google')} 
            style={styles.socialButton}
          >
            <FcGoogle style={styles.socialIcon} />
            Google
          </button>
          <button 
            onClick={() => handleOAuthSignup('facebook')} 
            style={{ ...styles.socialButton, backgroundColor: '#3b5998', color: 'white' }}
          >
            <FaFacebook style={styles.socialIcon} />
            Facebook
          </button>
          <button 
            onClick={() => handleOAuthSignup('github')} 
            style={{ ...styles.socialButton, backgroundColor: '#333', color: 'white' }}
          >
            <FaGithub style={styles.socialIcon} />
            GitHub
          </button>
        </div>

        <p style={styles.loginText}>
          Already have an account? <Link to="/login" style={styles.loginLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

// Reuse the same styles from Login with minor additions
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
  terms: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  checkbox: {
    marginTop: '0.2rem',
    minWidth: '1rem',
    minHeight: '1rem',
  },
  termsLabel: {
    color: '#2c3e50',
    fontSize: '0.8rem',
    lineHeight: '1.4',
  },
  termsLink: {
    color: '#3498db',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  signupButton: {
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
  loginText: {
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  loginLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default Signup;
