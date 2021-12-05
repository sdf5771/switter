import AuthForm from 'components/AuthForm';
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { authService } from '../fbase';

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
    <div>
        <AuthForm />
        <div>
            <button onClick={onSocialClick} name="github">Continue with Github</button>
            <button onClick={onSocialClick} name="google">Continue with Google</button>
        </div>
    </div>
    );
};
export default Auth;