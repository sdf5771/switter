import { updateProfile } from 'firebase/auth';
import { collection, where, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService, storageService } from '../fbase';
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

export default ({ refreshUser, userObj }) => { 
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userProfileImg, setUserProfileImg] = useState(""); // UserProfile Img
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
        let profileImgUrl = "";
        if(userProfileImg !== ""){
            const profileimgRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(profileimgRef, userProfileImg, "data_url");
            profileImgUrl = await getDownloadURL(profileimgRef).then();
        }
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser, {displayName: newDisplayName, photoURL: userProfileImg});
            refreshUser();
        }
        setUserProfileImg("");
    };
    const onFileChange = (event) => {
        const {target:{files}, } = event;
        const theFile = files[0];
        const reader = new FileReader(); // FileReader API
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: { result }} = finishedEvent;
            setUserProfileImg(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setUserProfileImg("");
    return (
        <>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} type="text" placeholder='Display Name' value={newDisplayName} />
            <input type="file" accept='image/*' onChange={onFileChange}/>
            <input type="submit" value="Update Profile"  />
            {userProfileImg && (
                <div>
                <img src={userProfileImg} width='50px' height='50px' border-radius='2px' />
                <button onClick={onClearAttachment}>Clear</button>
            </div>
            )}
        </form>
            <button onClick={onLogOutClick}>Log Out</button>
            
        </>
    );
};