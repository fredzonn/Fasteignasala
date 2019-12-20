/* eslint-disable max-len */
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const connectionString = process.env.DATABASE_URL;

/**
 * Framkvæmir SQL fyrirspurn á gagnagrunn sem keyrir á `DATABASE_URL`,
 * skilgreint í `.env`
 *
 * @param {string} q Query til að keyra
 * @param {array} values Fylki af gildum fyrir query
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Bætir við Notanda.
 *
 * @param {array} data Fylki af gögnum fyrir notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra nýskráninu
 */
async function insertUser(data) {
  const q = `
INSERT INTO users
(name, email, username, password, security, safety)
VALUES
($1, $2, $3, $4, $5, $6)`;
  const values = [data.name, data.email, data.username, data.password, data.security, data.safety];

  return query(q, values);
}

/**
 * Bætir við fyrirspurn.
 *
 * @param {array} data Fylki af gögnum fyrir fyrirspurn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function insertRequest(data) {
  const q = `
INSERT INTO requests
(house_id, request)
VALUES
($1, $2)`;

  return query(q, [data.id, data.request]);
}

/**
 * Bætir við tímapöntun.
 *
 * @param {array} data Fylki af gögnum fyrir pöntun
 * @returns {object} Hlut með niðurstöðu af því að keyra pöntun
 */
async function insertCheckin(data) {
  const q = `
INSERT INTO checkin
(house, username, day, time)
VALUES
($1, $2, $3, $4)`;

  return query(q, [data.house, data.user, data.day, data.time]);
}

/**
 * Sækir allar eignir
 *
 * @returns {array} Fylki af öllum fasteignum
 */
async function select() {
  const result = await query('SELECT * FROM houses ORDER BY id');

  return result.rows;
}

/**
 * Sækir fasteign
 *
 * @param {number} id Id á fasteign
 * @returns {object} Hlut með fasteign
 */
async function selectHouse(id) {
  const q = 'SELECT * FROM houses WHERE id = $1';
  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Sækir alla starfsmenn
 *
 * @returns {array} Fylki af öllum starfsmönnum
 */
async function selectEmployees() {
  const result = await query('SELECT * FROM employees ORDER BY id');

  return result.rows;
}

/**
 * Sækir starfsmann
 *
 * @param {number} id Id á starfsmann
 * @returns {object} Hlut með starfsmanni
 */
async function selectEmployee(id) {
  const q = 'SELECT * FROM employees WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Sækir fyrirspurnir
 *
 * @returns {array} Fylki af öllum fyrirspurnum
 */
async function selectRequests() {
  const result = await query('SELECT * FROM requests ORDER BY house_id');

  return result.rows;
}

/**
 * Sækir id fyrirspurna
 *
 * * @returns {array} Fylki af id allra húsa
 */
async function selectRequestById() {
  const result = await query('SELECT house_id FROM requests');

  return result.rows;
}

/**
 * Sækir pantanir
 *
 * * @returns {array} Fylki af öllum pöntunum
 */
async function selectCheckIns() {
  const result = await query('SELECT * FROM checkin');

  return result.rows;
}


/**
 * Uppfærir fasteign sem seldna.
 *
 * @param {number} id Id á fasteign
 * @returns {object} Hlut með niðurstöðu af því að keyra uppfærslu
 */
async function update(id) {
  const q = `
UPDATE houses
SET sold = true, updated = current_timestamp
WHERE id = $1`;

  return query(q, [id]);
}

/**
 * Sækir notanda eftir nafni.
 *
 * @param {string} username username á notanda
 * @returns {object} Hlut með notanda
 */
async function selectUser(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Sækir notanda eftir id.
 *
 * @param {number} id id á notanda
 * @returns {object} Hlut með notanda
 */
async function selectById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Sækir notendur
 *
 ** @returns {array} Fylki af öllum notendum
 */
async function selectUsers() {
  const result = await query('SELECT * FROM users ORDER BY id');

  return result.rows;
}

/**
 * Uppfærir notanda sem admin.
 *
 * @param {number} id Id á notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra uppfærslu
 */
async function updateAdmin(id) {
  const q = `
  UPDATE users SET admin = true WHERE id = $1`;

  return query(q, [id]);
}

/**
 * Uppfærir lykilorð notanda.
 *
 * @param {array} data Fylki af gögnum fyrir notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra uppfærslu
 */
async function updatePassword(data) {
  const q = `
  UPDATE users 
  SET password = $1 
  WHERE (username = $2 AND email = $3 AND security = $4 AND safety = $5)`;

  return query(q, [data.password, data.username, data.email, data.security, data.safety]);
}

/**
 * Eyðir fasteign.
 *
 * @param {number} id Id á fasteign
 * @returns {object} Hlut með niðurstöðu af því að keyra eyðslu
 */
async function deleteRow(id) {
  const q = 'DELETE FROM houses WHERE id = $1';

  return query(q, [id]);
}

/**
 * Athugar hvort lykilorð passi.
 *
 * @param {string} password lykilorð notanda.
 *  @param {array} user fylki af upplýsingum notanda.
 * @returns {array} Ef lykilorð passar notanda.
 */
async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }

  return false;
}


/**
 * Finnur notanda eftir notandanafni.
 *
 * @param {string} username username notanda.
 * @returns {object} Hlut með niðurstöðu af því að leita.
 */
async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Finnur notanda eftir netfangi.
 *
 * @param {string} email netfangi notanda.
 * @returns {object} Hlut með niðurstöðu af því að leita.
 */
async function findByEmail(email) {
  const q = 'SELECT * FROM users WHERE email = $1';

  const result = await query(q, [email]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Finnur notanda eftir öriggissvari.
 *
 * @param {string} email netfang notanda.
 * @returns {object} Hlut með niðurstöðu af því að leita.
 */
async function findBySafety(email) {
  const q = 'SELECT * FROM users WHERE safety = $1';

  const result = await query(q, [email]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

/**
 * Finnur notanda eftir id.
 *
 * @param {number} id id notanda.
 * @returns {object} Hlut með niðurstöðu af því að leita.
 */
async function findById(id) {
  const found = await selectById(id);

  if (found) {
    return Promise.resolve(found);
  }

  return Promise.resolve(null);
}

/**
 * Finnur notanda eftir notandanafni, emaili, öryggisspurningu og öryggissvari.
 *
 * @param {string} username username notanda.
 * @param {string} email netfang notanda.
 * @param {string} security öryggisspurning notanda.
 * @param {string} safety öryggissvar notanda.
 * @returns {object} Hlut með niðurstöðu ef notandi er til.
 */
async function findUser(data) {
  const q = `
  SELECT * FROM users 
  WHERE username = $1 AND email = $2 AND security = $3 AND safety = $4`;

  const result = await query(q, [data.username, data.email, data.security, data.safety]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

module.exports = {
  query,

  insertUser,
  insertRequest,
  insertCheckin,

  select,
  selectHouse,
  selectEmployees,
  selectEmployee,
  selectRequests,
  selectRequestById,
  selectCheckIns,
  selectUser,
  selectUsers,
  selectById,

  update,
  updateAdmin,
  updatePassword,
  deleteRow,

  comparePasswords,
  findByUsername,
  findByEmail,
  findBySafety,
  findById,
  findUser,
};
