
const bcrypt = require('bcrypt');

const { selectUser, selectById } = require('./db');

async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }

  return false;
}

async function findByUsername(username) {
  const found = await selectUser(username);

  if (found) {
    return Promise.resolve(found);
  }

  return Promise.resolve(null);
}

async function findById(id) {
  const found = await selectById(id);

  if (found) {
    return Promise.resolve(found);
  }

  return Promise.resolve(null);
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
};
