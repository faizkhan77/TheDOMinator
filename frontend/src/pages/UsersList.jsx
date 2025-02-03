import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import LoggedinNav from "../components/LoggedinNav";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access");

        try {
            const response = await axios.get("http://127.0.0.1:8000/api/users/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.username.toLowerCase().includes(query) ||
            (user.profile.full_name && user.profile.full_name.toLowerCase().includes(query)) ||
            (user.profile.role && user.profile.role.toLowerCase().includes(query)) ||
            (user.profile.skills && user.profile.skills.toLowerCase().includes(query))
        );
    });

    console.log(users);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility

    // Function to toggle the sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    return (
        <>
            {/* Sidebar Component */}
            <div className="hidden md:flex">
                <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            </div>
<div>
<LoggedinNav />
</div>
            

<div
    className={`lg:px-8 px-6 py-6 transition-all ${isSidebarOpen ? "margin-left 0.3s ease md:ml-[20%]" : "md:ml-[5%]"} duration-300 w-full mx-auto md:w-full lg:w-3/4`} // Use 'md:w-full' for small and medium screens
    style={{
        // marginLeft: isSidebarOpen ? "20%" : "10%", // Adjust margin-left based on sidebar state
        transition: "margin-left 0.3s ease", // Smooth transition for the shift
        maxHeight: "80vh", // Limit the height of the user list container to 80% of the viewport height
        overflowY: "auto", // Enable vertical scrolling once content exceeds maxHeight
    }}
>
    <h2 className="text-3xl font-semibold text-white mb-6">Users List</h2>

    {/* Search Input */}
    <input
        type="text"
        placeholder="Search users by name, role, or skills..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
    />

    {/* Display Users */}
    {filteredUsers.length > 0 ? (
        <ul className="list-none p-0">
            {filteredUsers.map((user) => (
                <li
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex items-center p-4 mb-4 bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition duration-300"
                >
                    <img
                        src={user.profile.avatar}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                        <h4 className="text-xl font-semibold text-white">{user.profile.full_name} ({user.username})</h4>
                        <p className="text-sm text-gray-400">Role: {user.profile.role}</p>
                        <p className="text-sm text-gray-400">Skills: {user.profile.skills}</p>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p className="text-white">No users found.</p>
    )}
</div>

        </>
    );
};

export default UsersList;
