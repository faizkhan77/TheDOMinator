import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "./Sidebar.css"
import { useNavigate } from "react-router-dom";  // Import useNavigate

import { Link } from 'react-router-dom';

const Sidebar = ({ toggleSidebar }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();  // Initialize navigate function
    // console.warn(props.profile.avatar)

    useEffect(() => {
        // ✅ Load user profile from localStorage
        const storedProfile = localStorage.getItem("userProfile");

        // console.warn("Stored profile:", storedProfile);
        setProfile(JSON.parse(storedProfile)); // ✅ Convert to object
        setUser(JSON.parse(localStorage.getItem("user")))

        // console.warn("profile", profile)

    }, []);

    const handleLogout = () => {
        logout()
        navigate("/login")
    }


    return (
        <div id="nav-bar">
            <input id="nav-toggle" type="checkbox" onChange={toggleSidebar} />
            <div id="nav-header">
                <Link id="nav-title" to="/loggedinhome" rel="noopener noreferrer">
                    <i className="fab fa-codepen"></i>TheDOMinator
                </Link>
                <label htmlFor="nav-toggle">
                    <span id="nav-toggle-burger"></span>
                </label>
                <hr />
            </div>
            <div id="nav-content">
                <div className="nav-button" onClick={() => navigate("/loggedinhome")}>
                    <i className="fas fa-home"></i>  {/* Changed from fa-palette */}
                    <span>Home</span>
                </div>
                <div className="nav-button" onClick={() => navigate(`/userslist`)}>
                    <i className="fas fa-user"></i>  {/* Changed from fa-images */}
                    <span>Users</span>
                </div>
                <div className="nav-button" onClick={() => navigate("/teams")}>
                    <i className="fas fa-users"></i>  {/* Changed from fa-thumbtack */}
                    <span>Teams</span>
                </div>
                <hr />
                <div className="nav-button" onClick={() => navigate("/activities")}>
                    <i className="fas fa-calendar-alt"></i>  {/* Changed from fa-heart */}
                    <span>Activities</span>
                </div>
                <div className="nav-button" onClick={() => navigate("/team/new")}>
                    <i className="fas fa-user-plus"></i>  {/* Changed from fa-heart */}
                    <span>Create a Team</span>
                </div>
                <div className="nav-button" onClick={() => navigate("/myteams")}>
                    <i className="fas fa-user-plus"></i>  {/* Changed from fa-heart */}
                    <span>My Teams</span>
                </div>
                {/* <div className="nav-button" onClick={() => navigate("/Chatboat")}>
                    <i className="fas fa-comments"></i>
                    <span>Chatbot</span>
                </div> */}

                <hr />
                <div className="nav-button" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>  {/* Changed from fa-gem */}
                    <span>Logout</span>
                </div>
                <div id="nav-content-highlight"></div>
            </div>

            <input id="nav-footer-toggle" type="checkbox" />
            <div id="nav-footer">
                <div id="nav-footer-heading">
                    <div id="nav-footer-avatar">
                        {<img src={profile?.avatar} alt="Avatar" />}
                    </div>
                    <div id="nav-footer-titlebox">
                        <Link id="nav-footer-title" to={`/user/${user?.id}`} rel="noopener noreferrer" style={{ fontSize: "15px" }}>
                            {profile ? profile.full_name : "Guest"}
                        </Link>
                        <span id="nav-footer-subtitle"></span>
                    </div>
                    <label htmlFor="nav-footer-toggle">
                        <i className="fas fa-caret-up"></i>
                    </label>
                </div>

            </div>
        </div>
    );
};

export default Sidebar;