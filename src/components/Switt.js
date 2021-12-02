import { dbService } from 'fbase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';

const Switt = ({ swittObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newSwitt, setNewSwitt] = useState(swittObj.text);
    const SwittTextRef = doc(dbService, "switts", `${swittObj.id}`);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this switt?");
        console.log(ok); // true or false
        if(ok){ // window.confirm ok는 true 를 반환
            // Delete Switts
            await deleteDoc(SwittTextRef);
        }
    };
    const toggleEditing = async () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(swittObj, newSwitt);
        await updateDoc(SwittTextRef, {
            text: newSwitt,
        });
        setEditing(false); // editing 모드 종료
    }
    const onChange = (event) => {
        const {target:{value}, } = event;
        setNewSwitt(value);
    }
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit your Switt" value={newSwitt} required onChange={onChange} />
                            <input type="submit" value="Update Switt" />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                    ) : (
                    <><h4>{swittObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Switt</button>
                            <button onClick={toggleEditing}>Edit Switt</button>
                        </>
                    )}
                    </>
                )
            }
        </div>
    )
};

export default Switt;