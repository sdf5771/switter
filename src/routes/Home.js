import Switt from 'components/Switt';
import { dbService } from 'fbase';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const Home = ({ userObj }) => {
    const [switt, setSwitt] = useState("");
    const [switts, setSwitts] = useState([]);
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
    console.log(switts);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={switt} onChange={onChange} type="text" placeholder="What's on your mind ? " maxLength={120}/>
                <input type="submit" value = "Switt"/>
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