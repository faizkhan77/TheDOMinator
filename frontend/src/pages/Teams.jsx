import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LoggedinNav from "../components/LoggedinNav";

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // ✅ State for search input

    useEffect(() => {
        getTeams();
    }, []);

    const getTeams = async () => {
        const token = localStorage.getItem("access");

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/teams/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setTeams(response.data);
            localStorage.setItem("teams", JSON.stringify(response.data));
        } catch (error) {
            console.error("Failed to fetch teams:", error);
        }
    };

    // ✅ Filter teams based on name or "looking_for" field
    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.looking_for &&
            team.looking_for.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility

    // Function to toggle the sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <>
            {/* Sidebar Component */}
            <div className="hidden md:flex">
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
            <LoggedinNav/>

            <div
                className={`px-8 py-6 transition-all duration-300`}
                style={{
                    marginLeft: isSidebarOpen ? "20%" : "10%", // Adjust margin-left based on sidebar state
                    transition: "margin-left 0.3s ease" // Smooth transition for the shift
                }}
            >
                <h2 className="text-3xl font-semibold text-white mb-6">Teams</h2>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search teams by name or required roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
                />

                {/* Create Team Button */}
                <Link to="/team/new">
                    <button className="w-full p-3 bg-primary text-white font-semibold rounded-lg mb-6 hover:bg-primary-dark transition duration-300">
                        Create Team
                    </button>
                </Link>

                {/* Display Teams */}
                {filteredTeams.length > 0 ? (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto"
                        style={{ maxHeight: '70vh' }} // Adjust the height as needed
                    >
                        {filteredTeams.map((team) => (
                            <div
                                key={team.id}
                                className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                            >
                                <Link to={`/team/${team.id}`} state={{ team }} className="block">
                                    <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">Looking for: {team.looking_for || "Not specified"}</p>
                                    <p className="text-sm mb-4">{team.description}</p>
                                    <p className="text-sm text-gray-400 mb-2">Admin: {team.admin.username}</p>
                                    <p className="text-sm text-gray-400">Members Limit: {team.members_limit}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white">No teams found.</p>
                )}
            </div>
        </>
    );
};

export default Teams;
