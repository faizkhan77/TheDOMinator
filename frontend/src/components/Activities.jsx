import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // Ensure you have date-fns installed

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userTeams = userProfile?.teams || []; // List of team IDs the user is part of

    useEffect(() => {
        // Only fetch and filter activities when the component mounts
        const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];

        // Filter activities to show only those belonging to the user's teams
        const filteredActivities = storedActivities.filter(
            (activity) => userTeams.includes(activity.teamId)
        );

        setActivities(filteredActivities);

        console.log("activities", userProfile)
    }, []); // Empty dependency array means this runs only once when the component mounts

    return (
        // <div className="p-4 shadow-lg rounded-xl bg-white">
        //     <h2 className="text-lg font-semibold mb-3">Team Activities</h2>
        //     {activities.length > 0 ? (
        //         <ul className="space-y-2">
        //             {activities.map((activity, index) => (
        //                 <li key={index} className="text-gray-700">
        //                     {activity.message} {/* Show activity message */}
        //                 </li>
        //             ))}
        //         </ul>
        //     ) : (
        //         <p className="text-gray-500">No recent activities.</p>
        //     )}
        // </div>

        <div className="hidden md:block bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-50 mb-8 text-center">
                Recent Activities
            </h2>
            {activities.length > 0 ? (
                <div className="space-y-8">
                    {activities
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort by newest first
                        .slice(0, 3) // Get the latest 3 activities
                        .map((activity, index) => {
                            const formattedTimestamp = format(
                                new Date(activity.timestamp),
                                "MMMM d, yyyy 'at' h:mm a"
                            );

                            return (
                                <div
                                    key={index}
                                    className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300"
                                >
                                    <div className="text-gray-300 text-base mt-4 italic">
                                        "{activity.message}"
                                    </div>
                                    <div className="text-gray-400 text-sm mt-2">
                                        {formattedTimestamp}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No recent activities.</p>
            )}
        </div>

    );
};

export default Activities;
