import React from "react";
import { Link } from "react-router-dom";

const RoomComponent = ({ rooms }) => {
    return (
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg w-[95%] max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-50">Available Teams</h2>
                <button className="bg-blue-500 text-gray-50 px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
                    + Create a Team
                </button>
            </div>
            {/* Scrollable container for rooms */}
            <div className="h-[400px] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {rooms.map((room) => (
                    <Link
                        to={`/team/${room.id}`}
                        key={room.id}
                        className="block bg-gray-700 p-6 rounded-xl hover:bg-gray-600 transition shadow-md"
                    >
                        <h3 className="font-semibold text-gray-50">@{room.admin.username}</h3>
                        <p className="text-sm text-gray-300 mt-1">{room.name}</p>
                        <div className="text-sm text-gray-400 mt-2">
                            {new Date(room.updated).toLocaleString()}
                        </div>
                        <div className="text-blue-400 text-sm mt-2">
                            {room.project_idea || "No role specified"}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RoomComponent;
