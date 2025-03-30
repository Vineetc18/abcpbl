import React from "react";
import '../Login/Login.css'
import { Link } from 'react-router-dom'
// Import assets
import video from '../Login assets/video.mp4'
import logo from '../Login assets/image.png'
// Import Icons
import { FaUserShield } from 'react-icons/fa'
import { BsFillShieldLockFill } from 'react-icons/bs'
import { AiOutlineSwapRight } from 'react-icons/ai'

const Login = () => {
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
                        <Link to={'/Register'}>
                            <button className='btn'>Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        {/* Fix: Remove empty src */}
                        <img src={logo} alt="Logo Image" style={{ width: "140px", height: "60px", display: "block", margin: "0 auto" }} />

                        <h3 style={{marginBottom:"0px"}}>Welcome Back </h3>
                    </div>
                    <form action="" className="form grid" style={{marginTop:"0px"}} >
                        <span className="showMessage">Login Status will go here</span>

                        <div className="inputDiv">
                            <label htmlFor="username">Username</label>
                            <div className="input flex">
                                <FaUserShield className='icon' />
                                <input type="text" id="username" placeholder="Enter Username" autoComplete="username" />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='icon' />
                                <input type="password" id="password" placeholder="Enter Password" autoComplete="current-password" />
                            </div>
                        </div>

                        <button type='submit' className="btn flex">
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                        <a href="/dashboard">Dashboard</a>
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
