import Switt from 'components/Switt';
import SwittFactory from 'components/SwittFactory';
import { dbService } from 'fbase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const Home = ({ userObj }) => {
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
    }, []);
    return (
        <div className='container'>
            <SwittFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
                {switts.map((switt) => (
                    <Switt key={switt.id} swittObj={switt} isOwner={switt.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    );
};

export default Home;