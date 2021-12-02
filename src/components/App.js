import React, {useState, useEffect} from 'react';
import AppRouter from 'components/Router';
import { authService } from '../fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    //listening user log in
    authService.onAuthStateChanged((user) => {
      if(user){
        // if user is log in
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        // if user log in is failed
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."} 
    <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
