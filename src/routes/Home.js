import { dbService } from 'fbase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const Home = () => {
    const [switt, setSwitt] = useState("");
    const [switts, setSwitts] = useState([]);
    const getSwitts = async() => {
        const q = query(collection(dbService,"switts"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            const swittObj = {
                ...doc.data(), // doc.data를 가져와서 unpack
                id:doc.id,
            }
            console.log(doc.data());
            setSwitts(prev => [swittObj, ...prev]);
        });
    };
    useEffect(() => {
        getSwitts();
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(dbService, "switts"),{
                switt,
                createAt : Date.now(),
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
                <div key={switt.id}>
                    <h4>{switt.switt}</h4>
                </div>))}
            </div>
        </div>
    );
};

export default Home;