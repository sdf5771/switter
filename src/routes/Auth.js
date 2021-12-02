import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { authService } from '../fbase';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) =>{
        const {target: {name, value}} = event;
        if (name === "email"){
            setEmail(value);
        } else if(name === "password"){
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            let data;
            if(newAccount) {
                // create account
                data = await createUserWithEmailAndPassword(authService,
                    email, password
                );
            } else {
                // Log In
                data = await signInWithEmailAndPassword(authService,
                    email, password
                );
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async(event) => {
        const {target:{name}} = event;
        let provider;
        if (name === "google"){
            //google social log in
            provider = new GoogleAuthProvider();
            const result = await signInWithPopup(authService, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential);
        } else if(name === "github"){
            //github social log in
            provider = new GithubAuthProvider();
            const result = await signInWithPopup(authService, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            console.log(credential);
        }
    }
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input name="email" type="email" placeholder='E-Mail' required value={email} onChange={onChange}/>
            <input name="password" type="password" placeholder='Password' required value={password} onChange={onChange}/>
            <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
            {error}
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        <div>
            <button onClick={onSocialClick} name="github">Continue with Github</button>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
        </div>
    </div>
    );
};
export default Auth;