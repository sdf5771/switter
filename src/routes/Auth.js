import AuthForm from 'components/AuthForm';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { authService } from '../fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import {
   faTwitter,
   faGoogle,
   faGithub,
 } from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
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
    <div className='authContainer'>
        <FontAwesomeIcon 
            icon={faTwitter}
            color={"#04AAFF"}
            size="3x"
            style={{ marginBottom: 30 }}
        />
        <AuthForm />
        <div className='authBtns'>
            <button onClick={onSocialClick} name="github" className='authBtn'>Continue with Github<FontAwesomeIcon icon={faGithub}/></button>
            <button onClick={onSocialClick} name="google" className='authBtn'>Continue with Google<FontAwesomeIcon icon={faGoogle}/></button>
        </div>
    </div>
    );
};
export default Auth;