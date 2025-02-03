import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TeamList = ({ onSelectTeam, searchQuery, setSearchQuery }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        getTeams();
    }, []);

    const getTeams = async () => {
        const token = localStorage.getItem("access");

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/teams/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setTeams(response.data);
        } catch (error) {
            console.error("Failed to fetch teams:", error);
        }
    };

    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (team.looking_for &&
            team.looking_for.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-50 mb-4 text-center">All Teams</h3>

            <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg mb-6 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />

            {filteredTeams.length > 0 ? (
                <ul className="space-y-4">
                    {filteredTeams.map((team) => (
                        <li key={team.id} className="bg-gray-800 p-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300">
                            <Link to={`/team/${team.id}`} state={{ team }} className="text-lg font-semibold text-gray-50">
                                {team.name} - Looking for: {team.looking_for || "Not specified"}
                            </Link>
                            {onSelectTeam && (
                                <button
                                    onClick={() => onSelectTeam(team)}
                                    className="mt-2 bg-indigo-500 text-white py-2 px-4 rounded-full hover:bg-indigo-400 transition-all duration-300"
                                >
                                    Select
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center">No teams found.</p>
            )}
        </div>
    );
};

export default TeamList;
