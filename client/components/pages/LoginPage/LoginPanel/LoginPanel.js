import React, { useEffect, useState } from 'react';

import R from 'ramda';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

import Block from 'react-bulma-companion/lib/Block';
import Box from 'react-bulma-companion/lib/Box';
import Button from 'react-bulma-companion/lib/Button';
import Checkbox from 'react-bulma-companion/lib/Checkbox';
import Title from 'react-bulma-companion/lib/Title';

import FormInput from '_components/elements/FormInput';

import GoogleLoginButton from '../../../elements/SocialLogin/signIn';

import { attemptLogin } from '_store/thunks/auth';

import useKeyPress from '_hooks/useKeyPress';

import styles from './styles.module.css';

export default function LoginPanel() {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  const login = (email=null, oauth=false) => {
    const userCredentials = { 
      username: oauth ? email: username, 
      password: oauth ? "1234" : password
    };

    if (remember) {
      localStorage.setItem('username', oauth ? email: username);
    }

    setLoading(true);
    dispatch(attemptLogin(userCredentials))
      .catch(R.identity)
      .finally(() => setLoading(false));
  };

  useKeyPress('Enter', login);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  const updateUsername = e => setUsername(e.target.value);
  const updatePassword = e => setPassword(e.target.value);

  return (
    <Box className={styles.root}>
      <Title size="3" textAlign="center">
        Login
      </Title>
      <hr className="separator" />
      <Block>
        Not Registered Yet?&nbsp;
        <Link to="/register">
          Create an account.
        </Link>
      </Block>
      <Block>
        <GoogleLoginButton oauthSignIn={login}/>
      </Block>
      <Block>
        <FormInput
          type="email"
          onChange={updateUsername}
          placeholder="Email"
          value={username}
          leftIcon={faUser}
        />
        <FormInput
          onChange={updatePassword}
          placeholder="Password"
          value={password}
          leftIcon={faLock}
          type="password"
        />
      </Block>
      <Block>
        <Link to="/recovery">
          Forgot your password?
        </Link>
      </Block>
      <hr className="separator" />
      <div className={styles.foot}>
        <Checkbox display="flex" alignItems="center">
          <input type="checkbox" onChange={rememberMe} checked={remember} />
          <span>&nbsp; Remember me</span>
        </Checkbox>
        <Button color="success" onClick={login} disabled={loading}>
          Login
        </Button>
      </div>
    </Box>
  );
}
