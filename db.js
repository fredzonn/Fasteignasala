const { Client } = require('pg');

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
 * Bætir við umsókn.
 *
 * @param {array} data Fylki af gögnum fyrir umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function insert(data) {
  const q = `
INSERT INTO houses
(name, price, firevalue, value, resting, type, rooms, livingrooms, bedrooms,
 bathrooms, year, img, about)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
  const values = [data.name, data.price, data.firevalue, data.value, data.resting,
    data.type, data.rooms, data.livingrooms, data.bedrooms, data.bathrooms, data.year,
    data.img, data.about];

  return query(q, values);
}

async function insertUser(data) {
  const q = `
INSERT INTO users
(name, email, username, password)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.email, data.username, data.password];

  return query(q, values);
}

/**
 * Sækir allar umsóknir
 *
 * @returns {array} Fylki af öllum umsóknum
 */
async function select() {
  const result = await query('SELECT * FROM houses ORDER BY id');

  return result.rows;
}

async function selectUser(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function selectById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function selectUsers() {
  const result = await query('SELECT * FROM users ORDER BY id');

  return result.rows;
}

/**
 * Uppfærir umsókn sem unna.
 *
 * @param {string} id Id á umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function update(id) {
  const q = `
UPDATE houses
SET processed = true, updated = current_timestamp
WHERE id = $1`;

  return query(q, id);
}

async function updateAdmin(id) {
  const q = `
UPDATE users SET admin = true WHERE id = $1`;

  return query(q, [id]);
}

/**
 * Eyðir umsókn.
 *
 * @param {string} id Id á umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function deleteRow(id) {
  const q = 'DELETE FROM houses WHERE id = $1';

  return query(q, [id]);
}

module.exports = {
  query,
  insert,
  insertUser,
  select,
  selectUser,
  selectUsers,
  selectById,
  update,
  updateAdmin,
  deleteRow, // delete er frátekið orð
};
