import React, { useState } from 'react';

const ChatApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const peopleList = [
    { name: 'Vincent Porter', status: 'left 7 mins ago', avatar: 'https://bootdey.com/img/Content/avatar/avatar1.png', active: false },
    { name: 'Aiden Chavez', status: 'online', avatar: 'https://bootdey.com/img/Content/avatar/avatar2.png', active: true },
    { name: 'Mike Thomas', status: 'online', avatar: 'https://bootdey.com/img/Content/avatar/avatar3.png', active: false },
    { name: 'Christian Kelly', status: 'left 10 hours ago', avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png', active: false },
    { name: 'Monica Ward', status: 'online', avatar: 'https://bootdey.com/img/Content/avatar/avatar8.png', active: false },
    { name: 'Dean Henry', status: 'offline since Oct 28', avatar: 'https://bootdey.com/img/Content/avatar/avatar3.png', active: false }
  ];

  const chatHistory = [
    { time: '10:10 AM', message: 'Hi Aiden, how are you? How is the project coming along?', sender: 'other', avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png' },
    { time: '10:12 AM', message: 'Are we meeting today?', sender: 'my', avatar: '' },
    { time: '10:15 AM', message: 'Project has been already finished and I have results to show you.', sender: 'my', avatar: '' }
  ];

  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="flex">
        <div className="w-72 p-4 bg-gray-800 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            
          </div>
          <ul className="list-none p-0">
            {peopleList.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase())).map((person, index) => (
              <li key={index} className={`flex items-center p-2 mb-2 rounded-lg ${person.active ? 'bg-gray-700' : 'bg-gray-800'}`}>
                <img src={person.avatar} alt="avatar" className="w-12 h-12 rounded-full mr-3" />
                <div className="flex flex-col">
                  <div className="font-semibold text-white">{person.name}</div>
                  <div className="text-gray-400 text-sm">{person.status}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 ml-4 bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h6 className="font-semibold text-white">Aiden Chavez</h6>
                <small className="text-gray-400">Last seen: 2 hours ago</small>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-400 hover:text-gray-200"><i className="fa fa-camera"></i></button>
              <button className="text-gray-400 hover:text-gray-200"><i className="fa fa-image"></i></button>
              <button className="text-gray-400 hover:text-gray-200"><i className="fa fa-cogs"></i></button>
              <button className="text-gray-400 hover:text-gray-200"><i className="fa fa-question"></i></button>
            </div>
          </div>
          <div className="chat-history mb-4">
            <ul className="list-none p-0">
              {chatHistory.map((chat, index) => (
                <li key={index} className={`flex mb-4 ${chat.sender === 'my' ? 'justify-end' : ''}`}>
                  {chat.sender === 'other' && <img src={chat.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />}
                  <div className={`max-w-xs ${chat.sender === 'my' ? 'bg-gray-700' : 'bg-blue-800'} p-4 rounded-lg text-sm text-white`}>
                    <p>{chat.message}</p>
                    <div className="text-xs text-gray-400 mt-2">{chat.time}</div>
                  </div>
                  {chat.sender === 'my' && <img src={chat.avatar || 'https://bootdey.com/img/Content/avatar/avatar2.png'} alt="avatar" className="w-10 h-10 rounded-full ml-3" />}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-message">
            <div className="flex items-center">
              <input type="text" className="form-control w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white" placeholder="Enter text here..." />
              <button className="ml-2 p-2 bg-blue-600 text-white rounded-full"><i className="fa fa-send"></i></button>
            </div>
          </div>
        </div>
        


        <div>
        <ul className="list-none p-0">
           <h1>admin {"moin"}</h1>
           <h1>Project Idea: {"hackaton room"}</h1>
           <h1>Room Type: {"PUBLIC"}</h1>
           <h1>Vacancies: {"5"}</h1>
           <h1>Created At:{" 1/25/2025, 10:55:45 AM"}</h1>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
