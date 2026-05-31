
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/components/LoginSignup/LoginSignup.css'
import { useAuth } from '../hooks'
import user_icon from '../../components/Assets/person.png'
import email_icon from '../../components/Assets/email.png'
import password_icon from '../../components/Assets/password.png'

const LoginSignup = () => {
    const [action, setAction] = useState("sign up");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [apiError, setApiError] = useState("");
    const { login, signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        try {
            if (action === "sign up") {
                if (!formData.name || !formData.email || !formData.password) {
                    setApiError("All fields are required");
                    return;
                }
                if (formData.password.length < 6) {
                    setApiError("Password must be at least 6 characters");
                    return;
                }
                await signup(formData.name, formData.email, formData.password);
                navigate('/dashboard');
            } else {
                if (!formData.email || !formData.password) {
                    setApiError("Email and password are required");
                    return;
                }
                await login(formData.email, formData.password);
                navigate('/dashboard');
            }
        } catch (error) {
            setApiError(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="form-wrapper">
            <div className="container">
                <div className="header">
                    <h1 className="title">{action === "sign up" ? "Create Account" : "Welcome Back"}</h1>
                    <p className="subtitle">{action === "sign up" ? "Join us today" : "Sign in to your account"}</p>
                </div>

                {apiError && (
                    <div className="error-message" role="alert">
                        ⚠️ {apiError}
                    </div>
                )}

                <form className="form" onSubmit={handleSubmit}>
                    <div className="inputs">
                        {action === "sign up" && (
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <img src={user_icon} alt="user" className="input-icon" />
                                    <input 
                                        type="text" 
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <div className="input-wrapper">
                                <img src={email_icon} alt="email" className="input-icon" />
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <img src={password_icon} alt="password" className="input-icon" />
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {action === "login" && (
                        <div className="forgot-password">
                            <a href="#forgot">Forgot Password?</a>
                        </div>
                    )}

                    <div className="button-group">
                        <button 
                            type="button"
                            className={`auth-button ${action === "sign up" ? "active" : "inactive"}`}
                            onClick={() => setAction("sign up")}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                        <button 
                            type="button"
                            className={`auth-button ${action === "login" ? "active" : "inactive"}`}
                            onClick={() => setAction("login")}
                            disabled={loading}
                        >
                            Login
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading 
                            ? (action === "sign up" ? "Creating Account..." : "Signing In...") 
                            : (action === "sign up" ? "Create Account" : "Sign In")
                        }
                    </button>
                </form>

                <p className="footer-text">
                    {action === "sign up" 
                        ? "Already have an account? " 
                        : "Don't have an account? "
                    }
                    <span 
                        className="toggle-link"
                        onClick={() => {
                            setAction(action === "sign up" ? "login" : "sign up");
                            setApiError("");
                        }}
                    >
                        {action === "sign up" ? "Login" : "Sign Up"}
                    </span>
                </p>
            </div>
        </div>
    );
};
export default LoginSignup;