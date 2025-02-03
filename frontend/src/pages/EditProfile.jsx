import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaLink } from "react-icons/fa";

const EditProfile = () => {
    const [profile, setProfile] = useState(null);
    const [profileData, setProfileData] = useState({
        user: "",
        full_name: "",
        role: "",
        skills: "",
        experience: "",
        github: "",
        linkedin: "",
        instagram: "",
        portfolio: "",
        teams: [],  // Initialize teams as an empty array
    });
    const [newAvatar, setNewAvatar] = useState(null); // For handling new avatar uploads
    const navigate = useNavigate();
    const { accessToken } = useAuth(); // Access token for authorization
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // ✅ Load profile data from localStorage

        const storedProfile = localStorage.getItem("userProfile");
        setProfile(JSON.parse(storedProfile)); // Set profile from localStorage



        // Populate form with the current profile data
        if (storedProfile) {
            const parsedProfile = JSON.parse(storedProfile);
            setProfileData({
                user: parsedProfile.user,
                full_name: parsedProfile.full_name,
                role: parsedProfile.role,
                skills: parsedProfile.skills,
                experience: parsedProfile.experience,
                github: parsedProfile.github,
                linkedin: parsedProfile.linkedin,
                instagram: parsedProfile.instagram,
                portfolio: parsedProfile.portfolio,
                teams: parsedProfile.teams || [], // Ensure teams is always an array
            });
        }
    }, []);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        setNewAvatar(e.target.files[0]); // Capture new avatar file
    };

    const validateURLs = () => {
        const newErrors = {};
        const urlFields = ["github", "linkedin", "instagram", "portfolio"];

        urlFields.forEach((field) => {
            const value = profileData[field];
            if (value && !value.startsWith("https://")) {
                newErrors[field] = "URL must start with https://";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        if (!validateURLs()) {
            return; // Stop the function if validation fails
        }

        const formData = new FormData();
        formData.append("user", profileData.user);
        formData.append("full_name", profileData.full_name);
        formData.append("role", profileData.role);
        formData.append("skills", profileData.skills);
        formData.append("experience", profileData.experience);
        formData.append("github", profileData.github);
        formData.append("linkedin", profileData.linkedin);
        formData.append("instagram", profileData.instagram);
        formData.append("portfolio", profileData.portfolio);

        if (newAvatar) {
            formData.append("avatar", newAvatar); // Append new avatar if changed
        }

        // Ensure teams field is not null by passing an empty array if no teams are selected
        (profileData.teams || []).forEach((teamId) => {
            formData.append("teams", teamId);  // Add each team ID to FormData
        });

        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/profiles/${profile.id}/`,
                formData,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const updatedProfile = response.data;

            // Update localStorage with the updated profile
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

            // Redirect back to the home page
            navigate("/loggedinhome");
        } catch (err) {
            console.error("Profile update failed:", err);
        }
    };



    console.log("profile", profile)

    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };


    return (
        <>
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="min-h-screen mt-4 text-gray-50 flex justify-center items-center">
                <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-2xl shadow-xl">
                    <h1 className="text-3xl font-bold text-center text-purple-500 mb-8">Edit Profile</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Details Section */}
                        <div>
                            <div className="flex flex-col gap-4 mb-6">
                                <label className="font-semibold">Avatar</label>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 rounded-full flex justify-center items-center overflow-hidden border-4 border-purple-500 shadow-lg">
                                        {profileData.avatar ? (
                                            <img
                                                src={profileData.avatar}
                                                alt="Avatar Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex justify-center items-center bg-gray-700 text-gray-400">
                                                No Avatar
                                            </div>
                                        )}
                                    </div>
                                    <label className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full shadow-md transition duration-300">
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="flex items-center gap-4">
                                    <label className="w-32">Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={profileData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    />
                                </div>

                                {/* Role */}
                                <div className="flex items-center gap-4">
                                    <label className="w-32">Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={profileData.role}
                                        onChange={handleChange}
                                        placeholder="Your current role"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    />
                                </div>

                                {/* Experience */}
                                <div className="flex items-center gap-4">
                                    <label className="w-32">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={profileData.experience}
                                        onChange={handleChange}
                                        placeholder="Years of experience"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links Section */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <FaGithub className="text-purple-500 text-2xl" />
                                    <input
                                        type="text"
                                        name="github"
                                        value={profileData.github}
                                        onChange={handleChange}
                                        placeholder="GitHub Profile URL"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    />
                                    {errors.github && <p className="text-red-500 text-sm">{errors.github}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaLinkedin className="text-blue-500 text-2xl" />
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={profileData.linkedin}
                                        onChange={handleChange}
                                        placeholder="LinkedIn Profile URL"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    />
                                    {errors.github && <p className="text-red-500 text-sm">{errors.github}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaInstagram className="text-pink-500 text-2xl" />
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={profileData.instagram}
                                        onChange={handleChange}
                                        placeholder="Instagram Profile URL"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                                    />
                                    {errors.github && <p className="text-red-500 text-sm">{errors.github}</p>}
                                </div>

                                <div className="flex items-center gap-4">
                                    <FaLink className="text-green-500 text-2xl" />
                                    <input
                                        type="text"
                                        name="portfolio"
                                        value={profileData.portfolio}
                                        onChange={handleChange}
                                        placeholder="Portfolio URL"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                    />
                                    {errors.github && <p className="text-red-500 text-sm">{errors.github}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="col-span-2">
                            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                            <textarea
                                name="skills"
                                value={profileData.skills}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Enter your skills"
                                className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSaveProfile}
                            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-full shadow-md transition duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default EditProfile;
