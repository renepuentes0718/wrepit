import React, { useCallback, useEffect, useState } from 'react';

import R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';

import { faRotate } from '@fortawesome/free-solid-svg-icons/faRotate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from 'react-bulma-companion/lib/Box';
import Button from 'react-bulma-companion/lib/Button';
import Column from 'react-bulma-companion/lib/Column';
import Columns from 'react-bulma-companion/lib/Columns';
import Control from 'react-bulma-companion/lib/Control';
import Field from 'react-bulma-companion/lib/Field';
import Help from 'react-bulma-companion/lib/Help';
import Icon from 'react-bulma-companion/lib/Icon';
import Image from 'react-bulma-companion/lib/Image';
import Input from 'react-bulma-companion/lib/Input';
import Label from 'react-bulma-companion/lib/Label';
import Textarea from 'react-bulma-companion/lib/Textarea';
import Title from 'react-bulma-companion/lib/Title';

import { attemptGetUser, attemptUpdateUser } from '_store/thunks/user';

import { validateName } from '_utils/validation';

export default function GeneralProfile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [firstNameEdited, setFirstNameEdited] = useState(false);
  const [lastNameEdited, setLastNameEdited] = useState(false);
  const [bioEdited, setBioEdited] = useState(false);
  const [profilePicEdited, setProfilePicEdited] = useState(false);

  const resetState = useCallback(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setBio(user.bio || '');
    setProfilePic(user.profilePic || '');
    setFirstNameEdited(false);
    setLastNameEdited(false);
    setBioEdited(false);
    setProfilePicEdited(false);
  }, [user]);

  useEffect(() => {
    resetState();
  }, [user, resetState]);

  const updateFirstName = e => {
    if (validateName(e.target.value)) {
      setFirstName(e.target.value);
      setFirstNameEdited(true);
    }
  };

  const updateLastName = e => {
    if (validateName(e.target.value)) {
      setLastName(e.target.value);
      setLastNameEdited(true);
    }
  };

  const updateBio = e => {
    setBio(e.target.value);
    setBioEdited(true);
  };

  const updateProfilePic = e => {
    setProfilePic(e.target.value);
    setProfilePicEdited(true);
  };

  const refresh = () => dispatch(attemptGetUser())
    .then(resetState)
    .catch(R.identity);

  const save = () => {
    const updatedUser = {};

    if (firstNameEdited) { updatedUser.firstName = firstName; }
    if (lastNameEdited) { updatedUser.lastName = lastName; }
    if (profilePicEdited) { updatedUser.profilePic = profilePic; }
    if (bioEdited) { updatedUser.bio = bio; }

    if (!R.isEmpty(updatedUser)) {
      dispatch(attemptUpdateUser(updatedUser))
        .catch(R.identity);
    }
  };

  const charactersRemaining = 240 - bio.length;
  const edited = firstNameEdited || lastNameEdited || bioEdited || profilePicEdited;

  return (
    <Box className="general-profile">
      <Icon size="medium" pull="right" onClick={refresh} onKeyPress={refresh}>
        <FontAwesomeIcon icon={faRotate} size="lg" />
      </Icon>
      <hr className="separator" />
      <Columns>
        <Column size="4">
          <Image>
            <Image.Content
              className="profile-img"
              src={profilePic || '/images/default-profile.png'}
              alt="Profile"
            />
          </Image>
          <Field>
            <Label htmlFor="profile-pic-url">
              Picture URL
            </Label>
            <Control>
              <Input
                id="profile-pic-url"
                placeholder="Picture URL"
                value={profilePic}
                onChange={updateProfilePic}
              />
            </Control>
          </Field>
        </Column>
        <Column size="8">
          <Columns>
            <Column size="6">
              <Field>
                <Label htmlFor="first-name" className="Label">
                  First Name
                </Label>
                <Control>
                  <Input
                    id="first-name"
                    placeholder="First Name"
                    value={firstName}
                    onChange={updateFirstName}
                  />
                </Control>
              </Field>
            </Column>
            <Column size="6">
              <Field>
                <Label htmlFor="last-name">
                  Last Name
                </Label>
                <Control>
                  <Input
                    id="last-name"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={updateLastName}
                  />
                </Control>
              </Field>
            </Column>
          </Columns>
          <Field>
            <Label htmlFor="bio">
              Bio
            </Label>
            <Control>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself."
                value={bio}
                maxLength={240}
                onChange={updateBio}
              />
            </Control>
            <Help>
              {`Characters remaining: ${charactersRemaining}`}
            </Help>
          </Field>
        </Column>
      </Columns>
      <hr className="separator" />
      <Button color="success" onClick={save} disabled={!edited}>
        Save
      </Button>
    </Box>
  );
}
