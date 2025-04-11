import React, { useState } from "react";
import "../Login/Login.css";
import { Link, useNavigate } from 'react-router-dom'
//Import out assets
import video from '../Login assets/video.mp4'
import logo from '../Login assets/image.png'
//Import Icons
import {FaUserShield} from 'react-icons/fa'
import {BsFillShieldLockFill} from 'react-icons/bs'
import {AiOutlineSwapRight} from 'react-icons/ai'
import {MdMarkEmailRead} from 'react-icons/md'

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        
        try {
            const response = await fetch("http://localhost:8000/api/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                const errorMsg = data.error || 
                    (data.username ? `Username: ${data.username[0]}` : "") ||
                    (data.email ? `Email: ${data.email[0]}` : "") ||
                    (data.password ? `Password: ${data.password[0]}` : "") ||
                    "Registration failed";
                setMessage(errorMsg);
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className='registerPage flex'>
        <div className='container flex'>

            <div className='videoDiv'>
                <video src={video} autoPlay muted loop ></video>
                
                <div className='textDiv'>
                    <h2 className='title'>Create and sell Extraordinary Products</h2>
                    <p>Adopt peace of Nature</p>
                </div>
                <div className="footerDiv flex">
                    <span className='text'>Have an account?</span>
                    <Link to={'/login'}>
                    <button className='btn'>Login</button>
                    </Link>

                </div>
            </div>

          <div className="formDiv flex">
            <div className="headerDiv">
                <img src={logo} alt="Logo Image" style={{ width: "140px", height: "60px", display: "block", margin: "0 auto" }} />
                <h3>Let Us Know You!</h3>
            </div>
            <form onSubmit={handleSubmit} className="form grid">
                {message && <span className={`showMessage ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>{message}</span>}
                
                <div className="inputDiv">
                    <label htmlFor="email">Email</label>
                    <div className="input flex">
                        <MdMarkEmailRead className='icon'/>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="inputDiv">
                    <label htmlFor="username">Username</label>
                    <div className="input flex">
                        <FaUserShield className='icon'/>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Enter Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="inputDiv">
                    <label htmlFor="password">Password</label>
                    <div className="input flex">
                        <BsFillShieldLockFill className='icon'/>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type='submit' className="btn flex" disabled={isLoading}>
                    <span>{isLoading ? "Registering..." : "Register"}</span>
                    <AiOutlineSwapRight className='icon'/>
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
export default Register
