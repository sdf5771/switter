import { updateProfile } from 'firebase/auth';
import { collection, where, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService } from '../fbase';

export default ({ userObj }) => { 
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
    };

    const getMySwitts = async() => {
        const q = query(
            collection(dbService, "switts"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    };

    useEffect(() => {
        getMySwitts();
    }, []);
    const onChange = (event) => {
        const {target:{value}, } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(userObj, {displayName: newDisplayName});
        }
    };
    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder='Display Name' value={newDisplayName} />
            <input type="submit" value="Update Profile"  />
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};