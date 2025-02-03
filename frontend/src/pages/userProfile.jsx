import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from "react-icons/fa"; // Import icons

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
            {/* Sidebar with toggle functionality */}
            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            <div
                className={`p-8 to-black min-h-screen transition-all duration-300`}
                style={{
                    marginLeft: isSidebarOpen ? "20%" : "10%",
                    transition: "margin-left 0.3s ease",
                }}
            >
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

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="col-span-1">
                        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={profile?.avatar}
                                    alt="User Avatar"
                                    className="rounded-full w-48 border-4 border-purple-500 mb-4"
                                />
                                <div>
                                    <h4 className="text-2xl font-semibold text-white">
                                        {profile?.full_name}
                                    </h4>
                                    <p className="text-gray-400 text-lg">{profile?.role}</p>
                                    <p className="text-gray-500 text-sm">{profile?.location}</p>
                                </div>
                            </div>

                            {/* Edit Button */}
                            {loggedInUser?.id === profile?.user && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={handleEditProfile}
                                        className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="bg-gray-800 rounded-2xl shadow-lg mt-6 p-6">
                            <ul className="space-y-4">
                                <li className="flex items-center text-gray-200">
                                    <FaGlobe className="mr-3 text-blue-400 text-xl" />
                                    <span className="text-gray-400">{profile?.website || "Not provided"}</span>
                                </li>
                                <li className="flex items-center text-gray-200">
                                    <FaGithub className="mr-3 text-blue-500 text-xl" />
                                    <span className="text-gray-400">{profile?.github || "Not provided"}</span>
                                </li>
                                {/* <li className="flex items-center text-gray-200">
                                    <FaFacebook className="mr-3 text-blue-600 text-xl" />
                                    <span className="text-gray-400">{profile?.facebook || "Not provided"}</span>
                                </li> */}
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

                    </div>

                    {/* Profile Details */}
                    <div className="col-span-2">
                        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
                            <div className="space-y-6">
                                <div className="flex justify-between">
                                    <h6 className="text-gray-200 text-lg font-medium">Full Name</h6>
                                    <p className="text-gray-400">{profile?.full_name}</p>
                                </div>
                                <div className="flex justify-between">
                                    <h6 className="text-gray-200 text-lg font-medium">Email</h6>
                                    <p className="text-gray-400">{profile?.email}</p>
                                </div>
                                <div className="flex justify-between">
                                    <h6 className="text-gray-200 text-lg font-medium">Role</h6>
                                    <p className="text-gray-400">{profile?.role}</p>
                                </div>
                                <div className="flex justify-between">
                                    <h6 className="text-gray-200 text-lg font-medium">Skills</h6>
                                    <p className="text-gray-400">{profile?.skills}</p>
                                </div>
                            </div>
                        </div>

                        {/* New Section: Bio & Experience */}
                        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mt-6 min-h-[345px]">
                            <h6 className="text-gray-200 text-lg font-semibold mb-4">Bio & Experience</h6>
                            <p className="text-gray-400 whitespace-pre-line">
                                {profile?.bio || "No bio available"}
                            </p>
                            <h6 className="text-gray-200 text-lg font-semibold mt-4">Experience</h6>
                            <p className="text-gray-400 whitespace-pre-line">
                                {profile?.experience || "No experience details provided"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
