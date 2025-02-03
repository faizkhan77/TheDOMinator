import React, { useState } from "react";

const RolesandSkills = ({ setSearchQuery }) => {
    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "UI/UX Designer",
        "Database Administrator",
        "Data Analyst",
        "DevOps Engineer"
    ];

    const skills = [
        "ReactJS",
        "NodeJS",
        "Django",
        "Machine Learning",
        "Figma",
        "Canva",
        "TailwindCSS"
    ];

    const [selectedCategory, setSelectedCategory] = useState("roles");

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
                <button
                    onClick={() => setSelectedCategory("roles")}
                    className={`px-6 py-2 rounded-full font-semibold text-white mr-4 transition-all duration-300 
                                ${selectedCategory === "roles" ? "bg-indigo-500" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    Roles
                </button>
                <button
                    onClick={() => setSelectedCategory("skills")}
                    className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 
                                ${selectedCategory === "skills" ? "bg-indigo-500" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                    Skills
                </button>
            </div>

            {selectedCategory === "roles" ? (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-50 text-center">Select a Role</h4>
                    <div className="flex flex-wrap justify-center">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSearchQuery(role)}
                                className="bg-gray-800 text-gray-50 py-2 px-4 rounded-full mx-2 my-1 hover:bg-gray-700 transition-all duration-300"
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-50 text-center">Select a Skill</h4>
                    <div className="flex flex-wrap justify-center">
                        {skills.map((skill) => (
                            <button
                                key={skill}
                                onClick={() => setSearchQuery(skill)}
                                className="bg-gray-800 text-gray-50 py-2 px-4 rounded-full mx-2 my-1 hover:bg-gray-700 transition-all duration-300"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesandSkills;
