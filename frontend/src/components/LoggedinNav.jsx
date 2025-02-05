import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoggedinNav = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
        setProfile(storedProfile);
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className={`bg-[#1f1e24]  p-4 shadow-md md:hidden relative 
        ${menuOpen ? "h-[40vh] absolute" : ""}`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link to="/loggedinhome" className="text-gray-50 text-xl font-bold flex items-center gap-2">
                    <i className="fab fa-codepen text-[#6556cd]"></i> TheDOMinator
                </Link>
                <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
                    <i className={`${menuOpen ? "fas fa-times" : "fas fa-bars"} text-gray-50 text-2xl transition-transform duration-100`}></i>
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`absolute left-0 w-full bg-[#1f1e24] shadow-lg rounded-b-lg transition-all duration-300 overflow-hidden ${menuOpen ? "h-[40vh] opacity-100" : "h-0 opacity-0"
                    }`}
            >
                <div className="p-4 flex flex-col space-y-4">
                    {/* Profile Section */}
                    <Link id="nav-footer-title" to={`/user/${user?.id}`} rel="noopener noreferrer" style={{ fontSize: "15px" }}>

                        <div className="flex items-center space-x-3 border-b border-gray-700 pb-3">
                            <img src={profile?.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-[#6556cd]" />
                            <div>
                                <p className="text-gray-50 font-medium">{profile ? profile.full_name : "Guest"}</p>
                                <p className="text-gray-400 text-xs">{user?.email || "No email available"}</p>
                            </div>
                        </div>

                    </Link>

                    {/* Navigation Links */}
                    <ul className="text-gray-50 space-y-2 text-lg">
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/loggedinhome")}>🏠 Home</li>
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/userslist")}>👥 Users</li>
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/teams")}>🚀 Teams</li>
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/activities")}>📌 Activities</li>
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/team/new")}>➕ Create a Team</li>
                        <li className="cursor-pointer hover:text-[#6556cd] transition" onClick={() => navigate("/myteams")}>📁 My Teams</li>
                        <li className="cursor-pointer text-red-500 hover:text-red-700 transition" onClick={handleLogout}>🚪 Logout</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default LoggedinNav;
