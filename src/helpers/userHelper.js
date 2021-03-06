import chalk from 'chalk';
const debug = require('debug')('app:user_helper');

export const generateUserObject = async (userData) => {

  // create username from email
  // const username = getUsernameFromEmail(userData.email);

  // create search keys
  const searchKeys = await getUserSearchKeys(userData.username, userData.name);

  const userObject = {
    _id: userData._id,
    username: userData.username,
    name: userData.name,
    avatar: userData.avatar,
    searchKeys: searchKeys
  };

  return userObject;
};

export const getUsernameFromEmail = (email) => {
  const array = email.split('@');
  debug(`Username generated: ${chalk.green(array[0])}`);
  return array[0];
};

export const getUserSearchKeys = async (username, name) => {

  debug(name);
  debug(username);

  // name
  const nameParts = name.toLowerCase().split('');
  const nameFirstKey = `${nameParts[0]}${nameParts[1]}`;

  // username
  const usernameParts = username.toLowerCase().split('');
  const usernameFirstKey = `${usernameParts[0]}${usernameParts[1]}`;

  // Keys
  const usernameSearchKeys = [usernameFirstKey];
  const nameKeys = [nameFirstKey];
  const searchKeys = [];

  const loopResult = new Promise((resolve) => {
    for (let i = 0; i < usernameParts.length; i++) {
      if (i > 1) {
        const lastIndex = usernameSearchKeys.length - 1;
        const newKey = `${usernameSearchKeys[lastIndex]}${usernameParts[i]}`;
        usernameSearchKeys.push(newKey);
        if(!searchKeys.includes(newKey)) searchKeys.push(newKey);
      }
    }

    for (let i = 0; i < nameParts.length; i++) {
      if (i !== 0 && i !== 1) {
        const lastIndex = nameKeys.length - 1;
        const newKey = `${nameKeys[lastIndex]}${nameParts[i]}`;
        nameKeys.push(newKey);
        if(!searchKeys.includes(newKey)) searchKeys.push(newKey);
      }
    }

    debug(searchKeys);

    resolve(searchKeys);
  });

  return await loopResult;

};

