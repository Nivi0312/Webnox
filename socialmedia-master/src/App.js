import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const UserContext = createContext(null); 

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}> {}
      <Router>
        <Routes>
          <Route path="/" element={<Home isHome={true} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myFeed" element={<Home />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export { UserContext };
export default App;
