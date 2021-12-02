import Switt from 'components/Switt';
import { dbService } from 'fbase';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const Home = ({ userObj }) => {
    const [switt, setSwitt] = useState("");
    const [switts, setSwitts] = useState([]);
    const [attachment, setAttachment] = useState(); // file url 관리
    useEffect(() => {
        const q = query(collection(dbService, "switts"), orderBy("createAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const swittArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSwitts(swittArr);
        });
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(dbService, "switts"),{
                text: switt,
                createAt: Date.now(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID : ", docRef.id);
        }catch(error){
            console.log("Error adding document : ", error);
        }
        setSwitt("");
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
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
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
            <div>
                {switts.map((switt) => (
                    <Switt key={switt.id} swittObj={switt} isOwner={switt.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;