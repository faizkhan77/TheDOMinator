import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Activities from "../components/Activities";
import TeamList from "../components/TeamList";
import RolesandSkills from "../components/RolesandSkills";
import Sidebar from "../components/Sidebar";

const LoggedinHome = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Lifted state

  useEffect(() => {
    // ✅ Load user profile from localStorage
    const storedProfile = localStorage.getItem("userProfile");

    console.warn("Stored profile:", storedProfile);


    setProfile(JSON.parse(storedProfile)); // ✅ Convert to object
    setUser(JSON.parse(localStorage.getItem("user")))

    console.warn("profile", profile)



  }, []);

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to track sidebar visibility

  // Function to toggle the sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  return (
    <div className="bg-primary">
      {/* <h1>Welcome, {user?.username}</h1>
      <h2>{profile?.full_name}</h2>
      <p>Role: {profile?.role}</p>
      <p>Skills: {profile?.skills}</p>
      <img src={profile?.avatar} alt="Profile" width="100" />

      <div>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div> */}
      <div className="flex">
        {/* Sidebar (Empty Space for Sidebar) */}
        <div
          className={`transition-all duration-300 ${isSidebarOpen ? "w-1/5" : "w-0"}`}
          style={{ overflow: 'hidden', marginLeft: "70px" }}
        >
          {/* Sidebar component will go here */}
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <div
          className={`transition-all duration-300 ${isSidebarOpen ? "ml-1/5" : "ml-0"}`}
          style={{ width: "100%", marginLeft: "30px", marginTop: "20px" }}
        >
          <div className="flex space-x-6">
            {/* Left Column - Roles and Skills */}
            <div className="w-1/4">
              <RolesandSkills setSearchQuery={setSearchQuery} />
            </div>

            {/* Middle Column - TeamList (Main Content) */}
            <div className="w-1/2">
              <TeamList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            {/* Right Column - Recent Activities */}
            <div className="w-1/4">
              <Activities />
            </div>
          </div>
        </div>
      </div>



    </div>
  );
};

export default LoggedinHome;
