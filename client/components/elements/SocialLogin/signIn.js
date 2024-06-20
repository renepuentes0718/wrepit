// src/components/GoogleLoginButton.js
import React from "react";
import { isExpired, decodeToken } from "react-jwt";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const oauthClientID =
  "227469946192-v5j2mjrp578vgjo9m85g5p11120hm8nr.apps.googleusercontent.com";

const GoogleLoginButton = (props) => {
  const handleLoginSuccess = (response) => {
    const myDecodedToken = decodeToken(response.credential);

    props.oauthSignIn(myDecodedToken.email, true);
  };

  const handleLoginError = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={oauthClientID}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
