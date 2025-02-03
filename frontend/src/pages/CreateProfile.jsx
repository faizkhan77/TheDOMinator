import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaFacebook,
    FaEnvelope,
    FaLink,
} from "react-icons/fa";

const CreateProfile = () => {
    const { accessToken, user } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        full_name: "",
        role: "",
        skills: "",
        experience: "",
        github: "",
        linkedin: "",
        instagram: "",
        portfolio: "",
    });

    const [error, setError] = useState("");
    const [linkerrors, setlinkErrors] = useState({});

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
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

        setlinkErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateURLs()) {
            return; // Stop the function if validation fails
        }


        console.log("🔹 Access Token:", accessToken);
        console.log("🔹 User Object:", user);
        console.log("🔹 User ID:", user?.id); // Check if user.id exists


        try {
            // ✅ Send POST request to create profile
            const response = await axios.post("http://127.0.0.1:8000/api/profiles/",
                {
                    ...profileData,
                    user: user.id,
                    teams: []  // Ensure teams is passed as an empty array if no teams selected
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const createdProfile = response.data; // Store API response

            // ✅ Store profile in localStorage
            localStorage.setItem("userProfile", JSON.stringify(createdProfile));

            // ✅ Redirect after profile setup
            navigate("/loggedinhome");
        } catch (err) {
            setError("Profile creation failed");
        }
    };


    return (
        <>


            <div className="min-h-screen mt-4  text-gray-50 flex justify-center items-center bg-primary">
                <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-2xl shadow-xl">
                    <h1 className="text-3xl font-bold text-center text-purple-500 mb-8">
                        Create Your Profile
                    </h1>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Personal Details Section */}
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="flex items-center gap-4">
                                        <label className="w-32">Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Enter your name"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                            value={profileData.full_name} onChange={handleChange} required
                                        />
                                    </div>

                                    {/* Role */}
                                    <div className="flex items-center gap-4">
                                        <label className="w-32">Role</label>
                                        <input
                                            type="text"
                                            placeholder="Your current role (e.g., Developer)"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                            name="role" value={profileData.role} onChange={handleChange} required
                                        />
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-center gap-4">
                                        <label className="w-32">Experience</label>
                                        <input
                                            type="text"  // We will keep this as text to manually control the input
                                            placeholder="Years of experience"
                                            name="experience" value={profileData.experience} onChange={handleChange}
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
                                            placeholder="GitHub Profile URL"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                            name="github" value={profileData.github} onChange={handleChange}
                                        />
                                        {linkerrors.github && <p className="text-red-500 text-sm">{linkerrors.github}</p>}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <FaLinkedin className="text-blue-500 text-2xl" />
                                        <input
                                            type="text"
                                            placeholder="LinkedIn Profile URL"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                            name="linkedin" value={profileData.linkedin} onChange={handleChange}
                                        />
                                        {linkerrors.github && <p className="text-red-500 text-sm">{linkerrors.github}</p>}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <FaInstagram className="text-pink-500 text-2xl" />
                                        <input
                                            type="text"
                                            placeholder="Instagram Profile URL"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                                            name="instagram" value={profileData.instagram} onChange={handleChange}
                                        />
                                        {linkerrors.github && <p className="text-red-500 text-sm">{linkerrors.github}</p>}
                                    </div>

                                    {/* <div className="flex items-center gap-4">
                                    <FaFacebook className="text-blue-600 text-2xl" />
                                    <input
                                        type="text"
                                        placeholder="Facebook Profile URL"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
                                    />
                                </div> */}

                                    {/* <div className="flex items-center gap-4">
                                    <FaEnvelope className="text-red-500 text-2xl" />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                                    />
                                </div> */}

                                    <div className="flex items-center gap-4">
                                        <FaLink className="text-green-500 text-2xl" />
                                        <input
                                            type="text"
                                            placeholder="Portfolio URL"
                                            className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                                            name="portfolio" value={profileData.portfolio} onChange={handleChange}
                                        />
                                        {linkerrors.github && <p className="text-red-500 text-sm">{linkerrors.github}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="col-span-2">
                                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                                <textarea
                                    placeholder="List your skills (e.g., JavaScript, React, Node.js)"
                                    className="w-full bg-gray-700 p-4 rounded h-40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    name="skills" value={profileData.skills} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 text-center">
                            <button type="submit" className=" bg-purple-500  hover:bg-purple-600 text-white px-6 py-2 rounded-full shadow-lg transition duration-300">
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProfile;
