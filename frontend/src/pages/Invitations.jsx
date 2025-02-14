import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import LoggedinNav from "../components/LoggedinNav";

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
    const userId = userProfile?.id; // Logged-in user ID

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        const token = localStorage.getItem("access");

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/invitations/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Filter only invitations sent to the logged-in user
            const receivedInvitations = response.data.filter(invite => invite.recipient.id === userProfile.user);
            setInvitations(receivedInvitations);

            // console.log(userId)
            // console.log("invitations", receivedInvitations)
            // console.log("data", response.data)
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
        }
    };

    const acceptInvitation = async (invite) => {
        const token = localStorage.getItem("access");
        const updatedTeams = [...(JSON.parse(localStorage.getItem("myTeams")) || []), invite.team];

        try {
            await axios.post(`http://127.0.0.1:8000/api/invitations/${invite.id}/respond/`, {
                action: "accept"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local storage
            localStorage.setItem("myTeams", JSON.stringify(updatedTeams));
            userProfile.teams = [...(userProfile.teams || []), invite.team.id];
            localStorage.setItem("userProfile", JSON.stringify(userProfile));

            // Remove accepted invitation from UI
            setInvitations(invitations.filter(i => i.id !== invite.id));
        } catch (error) {
            console.error("Failed to accept invitation:", error);
        }
    };

    const rejectInvitation = async (inviteId) => {
        const token = localStorage.getItem("access");

        try {
            await axios.post(`http://127.0.0.1:8000/api/invitations/${inviteId}/respond/`, {
                action: "reject"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove rejected invitation from UI
            setInvitations(invitations.filter(i => i.id !== inviteId));
        } catch (error) {
            console.error("Failed to reject invitation:", error);
        }
    };

    return (
        <>
            {/* Sidebar Component */}
            <div className="hidden md:flex">
                <Sidebar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            </div>
            <LoggedinNav />

            <div className={`lg:px-8 px-4 py-6 transition-all duration-300 ${isSidebarOpen ? "md:ml-[20%]" : "md:ml-[10%]"}`} style={{ overflowY: "auto" }}>
                <h2 className="text-3xl font-semibold text-white mb-6">My Invitations</h2>

                {invitations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
                        {invitations.map((invite) => (
                            <div key={invite.id} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                                <h3 className="text-xl font-semibold mb-2">{invite.team.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">Invited by: {invite.sender.username}</p>
                                <div className="flex justify-between">
                                    <button onClick={() => acceptInvitation(invite)} className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition">
                                        Accept
                                    </button>
                                    <button onClick={() => rejectInvitation(invite.id)} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-white">No invitations received.</p>
                )}
            </div>
        </>
    );
};

export default Invitations;
