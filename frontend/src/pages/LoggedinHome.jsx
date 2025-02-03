import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Activities from "../components/Activities";
import TeamList from "../components/TeamList";
import RolesandSkills from "../components/RolesandSkills";
import Sidebar from "../components/Sidebar";
import LoggedinNav from "../components/LoggedinNav";

const LoggedinHome = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Lifted state

  useEffect(() => {
    // Load user profile from localStorage
    const storedProfile = localStorage.getItem("userProfile");
    setProfile(JSON.parse(storedProfile)); // Convert to object
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar visibility

  // Toggle sidebar visibility (used on larger screens)
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar: full width on small screens */}
      <div className="md:hidden w-full">
        <LoggedinNav />
      </div>

      <div className="flex">
        {/* Sidebar: visible only on medium (md) screens and up */}
        <div
          className={`hidden md:block transition-all duration-300 ${
            isSidebarOpen ? "w-1/5 " : "w-0"
          }`}
          style={{ overflow: "hidden" }}
        >
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 lg:p-8">
          {/* For small and medium screens, stack columns vertically. On large screens, show as a row with spacing */}
          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Left Column - Roles and Skills */}
            <div className="w-full lg:w-1/4">
              <RolesandSkills setSearchQuery={setSearchQuery} />
            </div>

            {/* Middle Column - TeamList */}
            <div className="w-full lg:w-1/2">
              <TeamList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            {/* Right Column - Activities */}
            <div className="w-full lg:w-1/4">
              <Activities />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedinHome;
