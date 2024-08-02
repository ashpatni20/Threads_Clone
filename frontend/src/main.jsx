import React, { createContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

export const ThreadContext = createContext();

const ThreadContextProvider = () => {
  const [currUser, setCurrUser] = useState(JSON.parse(localStorage.getItem("ThreadDB")) || []);

  useEffect(() => {
    if (currUser) localStorage.setItem("ThreadDB", JSON.stringify(currUser));
  }, [currUser])

  console.log(currUser);
  return (
    <ThreadContext.Provider value={{ currUser, setCurrUser }}>
      <App />
    </ThreadContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThreadContextProvider />
  </React.StrictMode>,
)

