import React from 'react';
import { isExpired, decodeToken } from "react-jwt";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// import { handleError, handleSuccess } from '_utils/api';

const oauthClientID = "227469946192-v5j2mjrp578vgjo9m85g5p11120hm8nr.apps.googleusercontent.com";

const GoogleSignupButton = (props) => {
  const handleSignupSuccess = (response) => {
    const myDecodedToken = decodeToken(response.credential);

    props.registerGoogleUser(myDecodedToken.email, true)
  };

  const handleSignupError = (error) => {
    console.error('Signup Failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={oauthClientID}>
      <GoogleLogin
        onSuccess={handleSignupSuccess}
        onError={handleSignupError}
        context="signup"
        text="signup_with"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignupButton;