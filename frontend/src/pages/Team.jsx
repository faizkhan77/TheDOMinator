import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const Team = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const team = location.state?.team;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const profile = JSON.parse(localStorage.getItem("userProfile"));
    const userId = loggedInUser?.id;

    const [members, setMembers] = useState(team.members || []);

    if (!team) {
        return <p>No team data found.</p>;
    }

    const updateLocalStorageTeams = (updatedTeam) => {
        let teams = JSON.parse(localStorage.getItem("teams")) || [];

        // Replace the updated team in the stored teams array
        teams = teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t));

        localStorage.setItem("teams", JSON.stringify(teams));
    };

    // Update activities in localStorage
    const addActivity = (message, teamId) => {
        let activities = JSON.parse(localStorage.getItem("activities")) || [];
        const activity = { message, teamId, timestamp: new Date().toISOString() }; // Include teamId and timestamp
        activities.unshift(activity); // Add latest activity at the top
        localStorage.setItem("activities", JSON.stringify(activities));
    };

    const handleJoinTeam = async () => {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No access token found.");
            return;
        }

        try {
            // Join the team by making the API call
            await axios.post(
                `http://127.0.0.1:8000/api/teams/${team.id}/join/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedMembers = [...members, { id: userId, username: loggedInUser.username }];
            setMembers(updatedMembers);

            // Update the team in localStorage
            const updatedTeam = { ...team, members: updatedMembers };
            updateLocalStorageTeams(updatedTeam);

            // Add activity log
            addActivity(`${loggedInUser.username} joined ${team.name}`, team.id);

            // Update the user's profile with the new team ID
            const updatedProfile = {
                ...profile,
                teams: profile.teams ? [...profile.teams, team.id] : [team.id] // Append the new team ID
            };

            // Update the profile in localStorage
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

            // Send the request to update the user's profile in the backend
            await axios.patch(
                `http://127.0.0.1:8000/api/profiles/${profile.id}/`,
                { teams: updatedProfile.teams },
                { headers: { Authorization: `Bearer ${token}` } }
            );

        } catch (error) {
            console.error("Error joining team:", error.response?.data || error.message);
        }
    };

    const handleLeaveTeam = async () => {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No access token found.");
            return;
        }

        try {
            await axios.post(
                `http://127.0.0.1:8000/api/teams/${team.id}/leave/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove the user from the members list
            setMembers(members.filter((member) => member.id !== userId));

            // Remove the team ID from the user's profile in localStorage
            const updatedProfile = {
                ...profile,
                teams: profile.teams.filter((teamId) => teamId !== team.id)
            };
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

            // Send request to update the backend profile
            await axios.patch(
                `http://127.0.0.1:8000/api/profiles/${profile.id}/`,
                { teams: updatedProfile.teams },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Add activity log
            addActivity(`${loggedInUser.username} left ${team.name}`, team.id);

        } catch (error) {
            console.error("Error leaving team:", error.response?.data || error.message);
        }
    };

    const handleKickMember = async (memberId) => {
        const token = localStorage.getItem("access");
        if (!token) {
            console.error("No access token found.");
            return;
        }

        try {
            // Sending the request to kick the member
            await axios.post(
                `http://127.0.0.1:8000/api/teams/${team.id}/kick/`,
                { memberId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove the kicked member from the members list
            setMembers(members.filter((member) => member.id !== memberId));

            // Remove the team ID from the kicked member's profile in localStorage
            const updatedProfile = {
                ...profile,
                teams: profile.teams.filter((teamId) => teamId !== team.id)
            };
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

            // Send request to update the backend profile
            await axios.patch(
                `http://127.0.0.1:8000/api/profiles/${profile.id}/`,
                { teams: updatedProfile.teams },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Add activity log for kicking
            addActivity(`${memberUsername} was kicked from ${team.name} by ${loggedInUser.username}`, team.id);

        } catch (error) {
            console.error("Error kicking member:", error.response?.data || error.message);
        }
    };

    const goToChat = () => {
        if (team.chatroom_id) {
            navigate(`/chat/${team.chatroom_id}`, { state: { team } });
        } else {
            console.error("Chatroom ID not found for this team.");
        }
    };

    const isMember = members.some((member) => member.id === userId);
    const isFull = members.length >= team.members_limit;
    const isAdmin = team.admin.id === userId;

    console.warn("team data", team)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <>
            {/* Sidebar Component */}
            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            {/* Main Content */}
            <div
                className="text-white min-h-screen py-10 px-5 sm:px-10 lg:px-20 transition-all duration-300"
                style={{
                    marginLeft: isSidebarOpen ? "15%" : "1%", // Adjust based on sidebar state
                    transition: "margin-left 0.3s ease", // Smooth transition effect
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {/* Team Info Card */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold mb-4">{team.name} <span>
                            {team.admin.id === loggedInUser.id ?
                                <button
                                    onClick={() => navigate(`/team/edit/${team.id}`, { state: { team } })}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-green-700 transition duration-300"
                                >
                                    Edit Team
                                </button>
                                : null
                            }


                        </span></h1>
                        <p className="text-xl text-gray-400 mb-6">{team.description}</p>

                        {team.project_idea && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">Project Idea</h3>
                                <p>{team.project_idea}</p>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Looking For</h3>
                            <p>{team.looking_for}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Created On</h3>
                            <p>{new Date(team.created).toLocaleString()}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Last Updated</h3>
                            <p>{new Date(team.updated).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="mt-10">
                        <h3 className="text-3xl font-semibold mb-4">
                            Team Members ({members.length}/{team.members_limit})
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="bg-gray-800 text-white p-6 rounded-full shadow-lg text-center transform transition hover:scale-105 cursor-pointer"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                                            {member.profile && member.profile.avatar ? (
                                                <img
                                                    src={member.profile.avatar || "/avatar.svg"}
                                                    alt={member.username}
                                                    className="rounded-full w-full h-full object-cover"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
                                                />
                                            ) : (
                                                <span className="text-2xl font-semibold">
                                                    {member.username[0]}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-4 text-xl font-bold">@{member.username}</p>

                                        {/* Show "Admin" instead of role if the user is admin */}
                                        {member.id === team.admin_id ? (
                                            <p className="text-gray-400 font-semibold">Admin</p>
                                        ) : (
                                            <p className="text-gray-400">{member.profile?.role || "Member"}</p>
                                        )}

                                        {/* Kick Button: Only if the logged-in user is admin & the member is NOT the admin */}
                                        {isAdmin && member.id !== team.admin.id && (
                                            <button
                                                onClick={() => handleKickMember(member.id)}
                                                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-700 transition duration-300"
                                            >
                                                Kick
                                            </button>
                                        )}
                                        {member.id === team.admin.id && (
                                            "Admin"
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4">
                        {isAdmin ? (
                            <p className="text-red-400">Admins cannot leave.</p>
                        ) : isMember ? (
                            <button onClick={handleLeaveTeam} className="bg-red-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-red-700 transition duration-300">
                                Leave Team
                            </button>
                        ) : isFull ? (
                            <p className="text-red-400">Team is full.</p>
                        ) : (
                            <button onClick={handleJoinTeam} className="bg-green-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-green-700 transition duration-300">
                                Join Team
                            </button>
                        )}

                        {isMember && (
                            <button onClick={goToChat} className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300">
                                Chat
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Team;
