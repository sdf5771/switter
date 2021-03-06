import { updateProfile } from 'firebase/auth';
import { collection, where, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService, dbService, storageService } from '../fbase';
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export default ({ refreshUser, userObj }) => { 
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [userProfileImg, setUserProfileImg] = useState(""); // UserProfile Img
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
        refreshUser();
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
        <div className='container'>
        <form onSubmit={onSubmit} className='profileForm'>
            <input onChange={onChange} type="text" autoFocus placeholder='Display Name' value={newDisplayName} className='formInput'/>
            <input type="submit" value="Update Profile" className='formBtn' style={{ marginTop : 10, }} />
            <label for="attach-file" className='factoryInput__label'>
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input 
                    id='attach-file'
                    type='file'
                    accept='image/*'
                    onChange={onFileChange}
                    style={{
                        opacity: 0,
                    }}
                />
            {userProfileImg && (
                <div className='factoryForm__attachment'>
                        <img src={userProfileImg} style={{
                            backgroundImage: userProfileImg,
                        }}/>
                        <div className='factoryForm__clear' onClick={onClearAttachment}>
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                    </div>
            )}
        </form>
            <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};