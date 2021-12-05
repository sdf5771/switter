import { dbService, storageService } from 'fbase';
import { deleteObject, ref } from 'firebase/storage';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
            await deleteObject(ref(storageService, swittObj.attachmentUrl));
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
        <div className='switt'>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className='container swittEdit'>
                            <input type="text" placeholder="Edit your Switt" value={newSwitt} required autoFocus onChange={onChange} className='formInput' />
                            <input type="submit" value="Update Switt" className='formBtn'/>
                        </form>
                        <button onClick={toggleEditing} className='formBtn cancelBtn'>Cancel</button>
                    </>
                    ) : (
                    <><h4>{swittObj.text}</h4>
                    {swittObj.attachmentUrl && <img src={swittObj.attachmentUrl}/>}
                    {isOwner && (
                        <div className='switt__actions'>
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt}/>
                            </span>
                        </div>
                    )}
                    </>
                )
            }
        </div>
    )
};

export default Switt;