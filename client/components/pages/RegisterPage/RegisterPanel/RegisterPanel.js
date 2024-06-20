import React, { useState } from "react";

import R from "ramda";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Box from "react-bulma-companion/lib/Box";
import Button from "react-bulma-companion/lib/Button";
import Control from "react-bulma-companion/lib/Control";
import Element from "react-bulma-companion/lib/Element";
import Field from "react-bulma-companion/lib/Field";
import Help from "react-bulma-companion/lib/Help";
import Icon from "react-bulma-companion/lib/Icon";
import Input from "react-bulma-companion/lib/Input";
import Label from "react-bulma-companion/lib/Label";
import Title from "react-bulma-companion/lib/Title";

import GoogleSignUpButton from "../../../elements/SocialLogin/signUp";

import { postCheckUsername } from "_api/users";

import { attemptRegister } from "_store/thunks/auth";

import useKeyPress from "_hooks/useKeyPress";

import { validatePassword, validateEmail } from "_utils/validation";

import styles from "./styles.module.css";

export default function RegisterPanel() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [loading, setLoading] = useState(false);

  const checkPassword = (newUsername, newPassword) => {
    const { valid, message } = validatePassword(newUsername, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  // const checkUsername = newUsername => {
  //   const { valid, message } = validateUsername(newUsername);

  //   if (valid) {
  //     setUsernameMessage('Checking username...');
  //     setUsernameAvailable(false);

  //     postCheckUsername(newUsername)
  //       .then(res => {
  //         setUsernameAvailable(res.available);
  //         setUsernameMessage(res.message);
  //       })
  //       .catch(R.identity);
  //   } else {
  //     setUsernameAvailable(valid);
  //     setUsernameMessage(message);
  //   }
  // };

  const checkEmail = (email) => {
    console.log(validateEmail(email));

    if (validateEmail(email)) {
      setUsernameMessage("Checking email...");
      setUsernameAvailable(false);

      postCheckUsername(email)
        .then((res) => {
          setUsernameAvailable(res.available);
          setUsernameMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setUsernameAvailable(false);
      setUsernameMessage("Invalid email address.");
    }
  };

  const updateUsername = (newUserName) => {
    setUsername(newUserName);
    checkPassword(newUserName, password);
  };

  const handleUsernameChange = (e) => {
    e.preventDefault();
    updateUsername(e.target.value);
    checkEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPassword(username, e.target.value);
  };

  const register = (email = null, oauth = false) => {
    if (oauth) {
      const newUser = {
        username: email,
        password: "1234",
      };

      console.log(newUser);

      setLoading(true);
      dispatch(attemptRegister(newUser))
        .catch(R.identity)
        .finally(() => setLoading(false));
    } else if (usernameAvailable && passwordValid) {
      const newUser = {
        username,
        password,
      };

      setLoading(true);
      dispatch(attemptRegister(newUser))
        .catch(R.identity)
        .finally(() => setLoading(false));
    }
  };

  useKeyPress("Enter", register);

  return (
    <Box className={styles.root}>
      <Title size="3" textAlign="center">
        Register
      </Title>
      <hr className="separator" />
      <p className="has-space-below">
        Already a member?&nbsp;
        <Link to="/login">Login</Link>
      </p>
      <Field>
        <GoogleSignUpButton registerGoogleUser={register} />
      </Field>
      <Field>
        <Label htmlFor="username">Email</Label>
        <Control iconsRight>
          <Input
            id="username"
            placeholder="Email"
            color={
              username ? (usernameAvailable ? "success" : "danger") : undefined
            }
            value={username}
            type="email"
            onChange={handleUsernameChange}
          />
          {username && (
            <Icon
              size="small"
              align="right"
              color={usernameAvailable ? "success" : "danger"}
            >
              <FontAwesomeIcon
                icon={usernameAvailable ? faCheck : faTriangleExclamation}
              />
            </Icon>
          )}
        </Control>
        {username && (
          <Help color={usernameAvailable ? "success" : "danger"}>
            {usernameMessage}
          </Help>
        )}
      </Field>
      <Field>
        <Label htmlFor="password">Password</Label>
        <Control iconsRight>
          <Input
            id="password"
            placeholder="Password"
            type="password"
            color={
              password ? (passwordValid ? "success" : "danger") : undefined
            }
            value={password}
            onChange={handlePasswordChange}
          />
          {password && (
            <Icon
              size="small"
              align="right"
              color={passwordValid ? "success" : "danger"}
            >
              <FontAwesomeIcon
                icon={passwordValid ? faCheck : faTriangleExclamation}
              />
            </Icon>
          )}
        </Control>
        {password && (
          <Help color={passwordValid ? "success" : "danger"}>
            {passwordMessage}
          </Help>
        )}
      </Field>
      <hr className="separator" />
      <Element textAlign="right">
        <Button
          color="success"
          onClick={register}
          disabled={!passwordValid || !usernameAvailable || loading}
        >
          Create Account
        </Button>
      </Element>
    </Box>
  );
}
