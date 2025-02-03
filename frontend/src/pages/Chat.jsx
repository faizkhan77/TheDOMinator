import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Chat.css"
import LoggedinNav from "../components/LoggedinNav";

const Chat = () => {
    const { chatroomId } = useParams();  // Extract chatroomId from URL
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const userId = loggedInUser?.id;
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(""); // For searching team members
    const [team, setTeam] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        fetchTeamDetails();
        fetchMessages();
    }, [chatroomId]);

    // Fetch team details
    const fetchTeamDetails = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/teams/${chatroomId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTeam(response.data);
        } catch (error) {
            console.error("Error fetching team details:", error);
        }
    };

    // Fetch messages
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await axios.get(
                `http://127.0.0.1:8000/api/messages/?room=${chatroomId}`,  // ✅ Correct request
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data);  // Display messages in correct order
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Store activity logs in localStorage

    const addActivity = (message, teamId) => {
        let activities = JSON.parse(localStorage.getItem("activities")) || [];
        const activity = { message, teamId, timestamp: new Date().toISOString() }; // Include teamId and timestamp
        activities.unshift(activity); // Add latest activity at the top
        localStorage.setItem("activities", JSON.stringify(activities));
    };


    // Send new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/messages/",
                { room: chatroomId, content: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages((prevMessages) => [...prevMessages, response.data]);  // Append new message
            setNewMessage("");

            addActivity(`${loggedInUser.username} sent a message in ${team?.name}`, team.id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };


    if (!team) {
        return <h2>Loading chatroom...</h2>;
    }





    return (
        <>
        {/* Sidebar Component */}
        <div className="hidden md:flex">
            <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        <LoggedinNav />
    
        <div
            className={`container mx-auto p-4 min-h-screen transition-all duration-300 ${isSidebarOpen ? "margin-left 0.3s ease md:ml-[20%]" : "md:ml-[5%]"} `}
        >
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Chat Box (Move it to the top on small screens) */}
                <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md max-h-[calc(100vh-50px)] overflow-y-auto flex flex-col order-1 lg:order-2">
                    {/* Chat Header */}
                    <div className="flex items-center mb-4">
                        <img
                            src={team.admin.profile.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                            <h6 className="font-semibold text-white">{team.name}</h6>
                            <small className="text-gray-400">
                                Created: {new Date(team.created).toLocaleDateString("en-US", {
                                    weekday: "short", // "Mon"
                                    year: "numeric",  // "2025"
                                    month: "short",   // "Feb"
                                    day: "numeric",   // "3"
                                })}
                            </small>
                        </div>
                    </div>
    
                    {/* Chat Messages (Scrollable) */}
                    <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-4">
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index} className={`flex mb-4 ${msg.sender.id === userId ? "justify-end" : ""}`}>
                                    {msg.sender.id !== userId && (
                                        <img
                                            src={msg.sender.profile.avatar}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full mr-4"
                                        />
                                    )}
                                    <div
                                        className={`max-w-xs p-4 rounded-lg text-sm text-white ${msg.sender.id === userId ? "bg-gray-700" : "bg-blue-800"
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    {msg.sender.id === userId && (
                                        <img
                                            src={msg.sender.profile.avatar || "https://via.placeholder.com/40"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full ml-4"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
    
                    {/* Send Message Input (Fixed at Bottom) */}
                    <div className="border-t border-gray-700 pt-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-full">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
    
                {/* Team Members List */}
                <div className="w-full lg:w-72 p-4 bg-gray-800 rounded-lg shadow-md max-h-[calc(100vh-50px)] overflow-y-auto order-2 lg:order-1">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white mb-4"
                    />
                    <ul>
                        {team.members
                            .filter((person) =>
                                person.username.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((person, index) => (
                                <li key={index} className="flex items-center p-2 mb-2 rounded-lg bg-gray-700">
                                    <img
                                        src={person.profile.avatar || "https://via.placeholder.com/40"}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">{person.username} {person.id === team.admin.id ?
                                            "(Admin)" : ""}</div>
                                        <div className="text-gray-400 text-sm">{person.profile.role}</div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    </>
    

    );
};

export default Chat;
