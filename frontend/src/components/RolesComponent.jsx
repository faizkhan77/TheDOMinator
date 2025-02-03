import React from "react";

const RolesComponent = () => {
  return (
    <div className="hidden md:block bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-50 mb-6">
        Browse Roles
      </h2>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        <ul className="space-y-4">
          {[
            { name: "Python", count: 2 },
            { name: "Django", count: 4 },
            { name: "Data Structures & Algorithms (DSA)", count: 4 },
            { name: "JavaScript", count: 4 },
            { name: "Data Science", count: 3 },
            { name: "Machine Learning", count: 5 },
            { name: "React.js", count: 6 },
            { name: "Node.js", count: 2 },
            { name: "SQL", count: 3 },
            { name: "CSS", count: 1 },
            { name: "AWS", count: 3 },
          ].map((role, index) => (
            <li
              key={index}
              className="flex justify-between items-center text-gray-200 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition-colors shadow-sm"
            >
              <span className="truncate">{role.name}</span>
              <span className="bg-blue-600 text-gray-50 rounded-full px-4 py-1 text-xs font-medium">
                {role.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RolesComponent;
