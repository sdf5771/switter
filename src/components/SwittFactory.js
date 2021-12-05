import { dbService, storageService } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid'; // random uid Library

const SwittFactory = ({ userObj }) => {
    const [switt, setSwitt] = useState("");
    const [attachment, setAttachment] = useState(""); // file url 관리
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== '') {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url"); 
            attachmentUrl = await getDownloadURL(attachmentRef).then();
        }
        const swittObj = {
            text: switt,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        try{
            const docRef = await addDoc(collection(dbService, "switts"), swittObj);
            console.log("Document written with ID : ", docRef.id);
        }catch(error){
            console.log("Error adding document : ", error);
        }
        setSwitt("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {target:{value},} = event;
        setSwitt(value);
    };
    const onFileChange = (event) => {
        const {target:{files}, } = event;
        const theFile = files[0];
        const reader = new FileReader(); // FileReader API
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: { result }} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment("");
    return (
        <form onSubmit={onSubmit}>
                <input value={switt} onChange={onChange} type="text" placeholder="What's on your mind ? " maxLength={120}/>
                <input type='file' accept='image/*' onChange={onFileChange}/>
                <input type="submit" value = "Switt"/>
                {attachment && (
                    <div>
                        <img src={attachment} width='50px' height='50px'/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )} 
            </form> 
    );
};

export default SwittFactory;