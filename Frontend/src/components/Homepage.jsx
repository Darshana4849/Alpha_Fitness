import React, { useState } from 'react';
import { FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handlePostsClick = () => navigate('/SkillSharingPosts');
  const handleWorkoutsClick = () => navigate('/workoutPlans');
  const handleGetStarted = () => navigate('/workoutPlans');
  const handleLoginClick = () => navigate('/login');
  const handleSignupClick = () => navigate('/signup');

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.logoContainer}>
            <FiHeart style={styles.logoIcon} />
            <h1 style={styles.logoText}>FitPro</h1>
          </div>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav}>
            <a 
              href="#home" 
              style={{
                ...styles.navLink,
                color: activeTab === 'home' ? "#e74c3c" : "#2c3e50"
              }} 
              onClick={() => setActiveTab('home')}
            >
              Home
            </a>
            <button 
              style={{
                ...styles.navLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                color: activeTab === 'posts' ? "#e74c3c" : "#2c3e50"
              }} 
              onClick={() => {
                setActiveTab('posts');
                handlePostsClick();
              }}
            >
              Posts
            </button>
            <button 
              style={{
                ...styles.navLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                color: activeTab === 'workouts' ? "#e74c3c" : "#2c3e50"
              }} 
              onClick={() => {
                setActiveTab('workouts');
                handleWorkoutsClick();
              }}
            >
              Workouts
            </button>
            <button 
              style={styles.secondaryNavButton}
              onClick={handleLoginClick}
            >
              Login
            </button>
            <button 
              style={styles.getStartedButton}
              onClick={handleSignupClick}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} style={styles.mobileMenuButton}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={styles.mobileMenu}>
            <a 
              href="#home" 
              style={{
                ...styles.mobileNavLink,
                color: activeTab === 'home' ? "#e74c3c" : "#2c3e50"
              }}
              onClick={() => {
                setActiveTab('home');
                setIsMenuOpen(false);
              }}
            >
              Home
            </a>
            <button 
              style={{
                ...styles.mobileNavLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                font: 'inherit',
                textAlign: 'left',
                color: activeTab === 'posts' ? "#e74c3c" : "#2c3e50"
              }}
              onClick={() => {
                setActiveTab('posts');
                handlePostsClick();
                setIsMenuOpen(false);
              }}
            >
              Posts
            </button>
            <button 
              style={{
                ...styles.mobileNavLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                font: 'inherit',
                textAlign: 'left',
                color: activeTab === 'workouts' ? "#e74c3c" : "#2c3e50"
              }}
              onClick={() => {
                setActiveTab('workouts');
                handleWorkoutsClick();
                setIsMenuOpen(false);
              }}
            >
              Workouts
            </button>
            <button 
              style={styles.secondaryMobileNavButton}
              onClick={() => {
                handleLoginClick();
                setIsMenuOpen(false);
              }}
            >
              Login
            </button>
            <button 
              style={styles.mobileGetStartedButton}
              onClick={() => {
                handleSignupClick();
                setIsMenuOpen(false);
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Transform Your Body, Transform Your Life</h1>
          <p style={styles.heroText}>
            Join thousands of people achieving their fitness goals with our personalized workout plans and nutrition guidance.
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={styles.primaryButton}
              onClick={handleGetStarted}
            >
              Start Free Trial
            </button>
            <button style={styles.secondaryButton}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          <div style={styles.statItem}>
            <h3 style={styles.statNumber}>10K+</h3>
            <p style={styles.statLabel}>Active Members</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statNumber}>500+</h3>
            <p style={styles.statLabel}>Workout Plans</p>
          </div>
          <div style={styles.statItem}>
            <h3 style={styles.statNumber}>50+</h3>
            <p style={styles.statLabel}>Expert Trainers</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Start Your Fitness Journey?</h2>
          <p style={styles.ctaText}>
            Join our community today and get access to personalized workout plans, nutrition guidance, and expert support.
          </p>
          <button 
            style={styles.ctaButton}
            onClick={handleGetStarted}
          >
            Get Started - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerLogo}>
            <div style={styles.footerLogoContainer}>
              <FiHeart style={styles.footerLogoIcon} />
              <h3 style={styles.footerLogoText}>FitPro</h3>
            </div>
            <p style={styles.footerText}>
              Helping you achieve your fitness goals with personalized plans and expert guidance.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <a href="#home" style={styles.footerLink}>Home</a>
            <button 
              style={{
                ...styles.footerLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                textAlign: 'left',
                display: 'block',
                marginBottom: '0.5rem'
              }}
              onClick={handlePostsClick}
            >
              Posts
            </button>
          </div>
          <div style={styles.footerLinks}>
            <h4 style={styles.footerHeading}>Quick Links</h4>
            <a href="#home" style={styles.footerLink}>Home</a>
            <button 
              style={{
                ...styles.footerLink,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                font: 'inherit',
                textAlign: 'left',
                display: 'block',
                marginBottom: '0.5rem'
              }}
              onClick={handleWorkoutsClick}
            >
              Workouts
            </button>
          </div>
          <div style={styles.footerContact}>
            <h4 style={styles.footerHeading}>Contact Us</h4>
            <p style={styles.footerText}>hello@fitpro.com</p>
            <p style={styles.footerText}>+1 (555) 123-4567</p>
            <p style={styles.footerText}>123 Fitness St, Health City</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerBottomText}>© {new Date().getFullYear()} FitPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    color: "#333"
  },
  nav: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "1rem 2rem",
    position: "sticky",
    top: 0,
    zIndex: 100
  },
  navContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  logoIcon: {
    color: "#e74c3c",
    fontSize: "2rem"
  },
  logoText: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#2c3e50"
  },
  desktopNav: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "center"
  },
  navLink: {
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.3s ease"
  },
  secondaryNavButton: {
    backgroundColor: "transparent",
    color: "#2c3e50",
    border: "1px solid #2c3e50",
    padding: "0.5rem 1.5rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#f8f9fa"
    }
  },
  getStartedButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "0.5rem 1.5rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#c0392b"
    }
  },
  mobileMenuButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    display: "none"
  },
  mobileMenu: {
    backgroundColor: "#fff",
    padding: "1rem",
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  mobileNavLink: {
    textDecoration: "none",
    padding: "0.5rem",
    transition: "color 0.3s ease"
  },
  secondaryMobileNavButton: {
    backgroundColor: "transparent",
    color: "#2c3e50",
    border: "1px solid #2c3e50",
    padding: "0.5rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
    textAlign: "center"
  },
  mobileGetStartedButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "0.5rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem"
  },
  heroSection: {
    padding: "4rem 2rem",
    backgroundColor: "#e74c3c",
    color: "white",
    textAlign: "center"
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: 700,
    marginBottom: "1rem"
  },
  heroText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    lineHeight: 1.6
  },
  heroButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center"
  },
  primaryButton: {
    backgroundColor: "#fff",
    color: "#e74c3c",
    border: "none",
    padding: "0.8rem 2rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "2px solid #fff",
    padding: "0.8rem 2rem",
    borderRadius: "5px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },
  statsSection: {
    padding: "3rem 2rem",
    backgroundColor: "#fff"
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: "2rem",
    maxWidth: "1000px",
    margin: "0 auto"
  },
  statItem: {
    textAlign: "center"
  },
  statNumber: {
    fontSize: "2.5rem",
    color: "#e74c3c",
    margin: 0
  },
  statLabel: {
    color: "#7f8c8d",
    fontWeight: 500
  },
  ctaSection: {
    padding: "4rem 2rem",
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center"
  },
  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  ctaTitle: {
    fontSize: "2rem",
    marginBottom: "1.5rem"
  },
  ctaText: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    lineHeight: 1.6
  },
  ctaButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "1rem 2.5rem",
    borderRadius: "5px",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  footer: {
    backgroundColor: "#1a252f",
    color: "#fff",
    padding: "3rem 2rem",
    textAlign: "center"
  },
  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "2rem",
    textAlign: "left"
  },
  footerLogo: {},
  footerLogoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem"
  },
  footerLogoIcon: {
    color: "#e74c3c",
    fontSize: "1.5rem"
  },
  footerLogoText: {
    margin: 0,
    fontSize: "1.3rem"
  },
  footerText: {
    color: "#95a5a6",
    lineHeight: 1.6
  },
  footerLinks: {},
  footerHeading: {
    fontSize: "1.2rem",
    marginBottom: "1rem"
  },
  footerLink: {
    display: "block",
    color: "#95a5a6",
    textDecoration: "none",
    marginBottom: "0.5rem",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#e74c3c"
    }
  },
  footerContact: {},
  footerBottom: {
    marginTop: "3rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.1)"
  },
  footerBottomText: {
    color: "#95a5a6",
    margin: 0
  }
};

export default Homepage;