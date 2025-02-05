import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa"; // Import icons
import LoggedinNav from "../components/LoggedinNav";

const UserProfile = () => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { id } = useParams(); // ✅ Get user ID from URL
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in user

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("access");

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setUser(response.data.username);
            setProfile(response.data.profile);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/editprofile");
    };

    // Function to toggle the sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    console.log("loggedin user", loggedInUser?.id)
    console.log("profile", profile?.id)

    return (
        <>
            <div className="hidden md:flex">
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
            <div>
                <LoggedinNav />
            </div>

            <div className={`p-6 min-h-screen transition-all duration-300 max-w-6xl mx-auto ${isSidebarOpen ? "md:ml-[20%]" : "md:ml-[10%]"}`}>
                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex space-x-3 text-gray-300">
                        <li>
                            <Link to="/loggedinhome" className="text-blue-400 hover:underline">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <span className="text-blue-400 hover:underline">User</span>
                        </li>
                        <li>/</li>
                        <li className="text-gray-100">User Profile</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={profile?.avatar}
                                alt="User Avatar"
                                className="rounded-full w-36 md:w-48 border-4 border-purple-500 mb-4"
                            />
                            <h4 className="text-2xl font-semibold text-white">{profile?.full_name}</h4>
                            <p className="text-gray-400 text-lg">{profile?.role}</p>
                            <p className="text-gray-500 text-sm">{profile?.location}</p>
                        </div>

                        {/* Edit Button */}
                        {loggedInUser?.id === profile?.user && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleEditProfile}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>



                    {/* Profile Details */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
                        <h6 className="text-gray-200 text-lg font-semibold mb-4">Profile Details</h6>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <h6 className="text-gray-200">Full Name</h6>
                                <p className="text-gray-400">{profile?.full_name}</p>
                            </div>
                            <div className="flex justify-between">
                                <h6 className="text-gray-200">Email</h6>
                                <p className="text-gray-400">{profile?.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <h6 className="text-gray-200">Role</h6>
                                <p className="text-gray-400">{profile?.role}</p>
                            </div>
                            <div className="flex justify-between">
                                <h6 className="text-gray-200">Skills</h6>
                                <p className="text-gray-400">{profile?.skills}</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
                        <h6 className="text-gray-200 text-lg font-semibold mb-4">Social Links</h6>
                        <ul className="space-y-4">
                            <li className="flex items-center text-gray-200">
                                <FaGlobe className="mr-3 text-blue-400 text-xl" />
                                <span className="text-gray-400">{profile?.website || "Not provided"}</span>
                            </li>
                            <li className="flex items-center text-gray-200">
                                <FaGithub className="mr-3 text-blue-500 text-xl" />
                                <span className="text-gray-400">{profile?.github || "Not provided"}</span>
                            </li>
                            <li className="flex items-center text-gray-200">
                                <FaInstagram className="mr-3 text-pink-400 text-xl" />
                                <span className="text-gray-400">{profile?.instagram || "Not provided"}</span>
                            </li>
                            <li className="flex items-center text-gray-200">
                                <FaLinkedin className="mr-3 text-blue-700 text-xl" />
                                <span className="text-gray-400">{profile?.linkedin || "Not provided"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Bio & Experience */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
                        <h6 className="text-gray-200 text-lg font-semibold mb-4">Bio & Experience</h6>
                        <p className="text-gray-400 whitespace-pre-line">{profile?.bio || "No bio available"}</p>
                        <h6 className="text-gray-200 text-lg font-semibold mt-4">Experience</h6>
                        <p className="text-gray-400 whitespace-pre-line">{profile?.experience || "No experience details provided"}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
