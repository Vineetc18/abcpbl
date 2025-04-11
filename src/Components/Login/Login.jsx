import React, { useState, useEffect } from "react";
import '../Login/Login.css'
import { Link, useNavigate } from 'react-router-dom'
// Import assets
import video from '../Login assets/video.mp4'
import logo from '../Login assets/image.png'
// Import Icons
import { FaUserShield } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiOutlineSwapRight } from 'react-icons/ai'

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Function to get CSRF token
    const getCsrfToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/csrf/", {
                method: "GET",
                credentials: "include", // Important for cookies
            });
            if (!response.ok) {
                throw new Error('Failed to get CSRF token');
            }
            // The token will be automatically set in the cookies
        } catch (error) {
            console.error("Error getting CSRF token:", error);
            setMessage("Error setting up secure connection");
        }
    };

    // Get CSRF token when component mounts
    useEffect(() => {
        getCsrfToken();
        
        // Check if there's a login message in localStorage
        const loginMessage = localStorage.getItem("loginMessage");
        if (loginMessage) {
            setMessage(loginMessage);
            // Remove the message after displaying it
            localStorage.removeItem("loginMessage");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        
        console.log("Attempting login with:", { username });
        
        try {
            // Get the CSRF token from cookies
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch("http://localhost:8000/api/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include", // Important for cookies
                body: JSON.stringify({ username, password }),
            });

            console.log("Login response status:", response.status);
            
            // For 500 Internal Server Error, show a more specific message
            if (response.status === 500) {
                setMessage("Server error. Please check that the backend server is running properly.");
                console.error("Server error (500) during login");
                setIsLoading(false);
                return;
            }

            let data;
            try {
                data = await response.json();
                console.log("Login response data:", data);
            } catch (err) {
                // If the response can't be parsed as JSON
                setMessage("Server error. Please try again later.");
                console.error("Login response parsing error:", err);
                setIsLoading(false);
                return;
            }
            
            if (response.ok) {
                setMessage("Login successful!");
                // Store login status and user data in localStorage
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userData", JSON.stringify(data.user));
                
                // Add a small delay to ensure session is set
                setTimeout(() => {
                    if (data.redirect_url) {
                        navigate(data.redirect_url, { replace: true });
                    } else {
                        navigate("/dashboard", { replace: true });
                    }
                }, 1000);
            } else {
                setMessage(data.error || "Invalid username or password");
            }
        } catch (error) {
            setMessage(error.message || "An error occurred. Please try again.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='loginPage flex'>
            <div className='container flex'>

                <div className='videoDiv'>
                    <video src={video} autoPlay muted loop ></video>

                    <div className='textDiv'>
                        <h2 className='title'>Create and sell Extraordinary Products</h2>
                        <p>Adopt peace of Nature</p>
                    </div>
                    <div className="footerDiv flex">
                        <span className='text'>Don't have an account?</span>
                        <Link to={'/register'}>
                            <button className='btn'>Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo Image" style={{ width: "140px", height: "60px", display: "block", margin: "0 auto" }} />

                        <h3 style={{marginBottom:"0px"}}>Welcome Back </h3>
                    </div>
                    <form onSubmit={handleSubmit} className="form grid" style={{marginTop:"0px"}} >
                        {message && <span className={`showMessage ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>{message}</span>}

                        <div className="inputDiv">
                            <label htmlFor="username">Username</label>
                            <div className="input flex">
                                <FaUserShield className='icon' />
                                <input 
                                    type="text" 
                                    id="username" 
                                    placeholder="Enter Username" 
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input 
                                    type="password" 
                                    id="password" 
                                    placeholder="Enter Password" 
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type='submit' className="btn flex" disabled={isLoading}>
                            <span>{isLoading ? "Logging in..." : "Login"}</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                        <span className="forgotPassword">
                            Forgot your password? <a href="">Click Here</a>
                        </span>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login;
