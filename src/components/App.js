import React, {useState, useEffect} from 'react';
import AppRouter from 'components/Router';
import { authService } from '../fbase';
import { updateProfile } from 'firebase/auth';

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
        //setUserObj(user);
        setUserObj({
          displayName : user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(user,{displayName: user.displayName, photoURL: user.photoURL}),
        });
      } else {
        // if user log in is failed
        setIsLoggedIn(false);
        //setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    //setUserObj(Object.assign({}, user));
    setUserObj({
      displayName : user.displayName,
      uid : user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
    {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."} 
    <footer>&copy; {new Date().getFullYear()} Switter</footer>
    </>
  );
}

export default App;
