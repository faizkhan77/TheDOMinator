import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaLink, FaMapMarkerAlt } from "react-icons/fa";
import LoggedinNav from "../components/LoggedinNav";

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
        email: "",
        bio: "",
        location: ""
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
                email: parsedProfile.email,
                location: parsedProfile.location,
                bio: parsedProfile.bio,
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
        formData.append("email", profileData.email);
        formData.append("location", profileData.location);
        formData.append("bio", profileData.bio);

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
            navigate(`/user/${profile.user}`);
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
            <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="hidden md:flex">
                    <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <LoggedinNav />

                    <div className={`min-h-screen mt-4 text-gray-50 flex justify-center items-center px-4 sm:px-6 ${isSidebarOpen ? "md:ml-[20%]" : "md:ml-[10%]"}`}>
                        <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-2xl shadow-xl">
                            <h1 className="text-2xl sm:text-3xl font-bold text-center text-purple-500 mb-6 sm:mb-8">Edit Profile</h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {/* Personal Details Section */}
                                <div>
                                    <div className="flex flex-col gap-4 mb-6">
                                        <label className="font-semibold">Avatar</label>
                                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                            <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full flex justify-center items-center overflow-hidden border-4 border-purple-500 shadow-lg">
                                                {(
                                                    <img
                                                        src={profile?.avatar || "/avatar.svg"}
                                                        alt="Avatar Preview"
                                                        className="w-full h-full object-cover"
                                                    />

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

                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Personal Details</h2>
                                    <div className="space-y-4">
                                        {["full_name", "role", "experience"].map((field, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <label className="w-32">{field.replace("_", " ")}</label>
                                                <input
                                                    type="text"
                                                    name={field}
                                                    value={profileData[field]}
                                                    onChange={handleChange}
                                                    placeholder={`Enter your ${field.replace("_", " ")}`}
                                                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Links Section */}
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Social Links</h2>
                                    <div className="space-y-4">
                                        {[
                                            { name: "github", icon: <FaGithub className="text-purple-500 text-2xl" /> },
                                            { name: "linkedin", icon: <FaLinkedin className="text-blue-500 text-2xl" /> },
                                            { name: "instagram", icon: <FaInstagram className="text-pink-500 text-2xl" /> },
                                            { name: "portfolio", icon: <FaLink className="text-green-500 text-2xl" /> },
                                        ].map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                {item.icon}
                                                <input
                                                    type="text"
                                                    name={item.name}
                                                    value={profileData[item.name]}
                                                    onChange={handleChange}
                                                    placeholder={`${item.name.charAt(0).toUpperCase() + item.name.slice(1)} URL`}
                                                    className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                                />
                                                {errors[item.name] && <p className="text-red-500 text-sm">{errors[item.name]}</p>}
                                            </div>
                                        ))}

                                        {/* Email Field */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                                            <FaEnvelope className="text-green-500 text-2xl" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                placeholder="Email Address"
                                                className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                        </div>

                                        {/* Location Field */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
                                            <FaMapMarkerAlt className="text-green-500 text-2xl" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleChange}
                                                placeholder="Location"
                                                className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                            />
                                            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                                        </div>
                                    </div>
                                </div>


                                {/* Bio Section */}
                                <div div className="col-span-1 sm:col-span-2" >
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Bio</h2>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter your skills"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    ></textarea>
                                </div >

                                {/* Skills Section */}
                                <div div className="col-span-1 sm:col-span-2" >
                                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">Skills</h2>
                                    <textarea
                                        name="skills"
                                        value={profileData.skills}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter your skills"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    ></textarea>
                                </div >
                            </div >

                            <div className="flex justify-center mt-6 sm:mt-8">
                                <button
                                    onClick={handleSaveProfile}
                                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-full shadow-md transition duration-300"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div >
                    </div >
                </div >
            </div >

        </>

    );
};

export default EditProfile;
