const express = require('express');

const { selectUsers, updateAdmin } = require('./db');

const router = express.Router();

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Ósamstilltur route handler fyrir umsóknarlista.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function admin(req, res) {
  const users = await selectUsers();

  const data = {
    title: 'Notendur',
    users,
    user: req.user,
  };

  return res.render('admin', data);
}

/**
 * Ósamstilltur route handler sem breytir notanda í admin.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
async function adminUpdate(req, res) {
  const { checkAdmin } = req.body;
  checkAdmin.forEach(async (id) => {
    await updateAdmin(id);
  });

  return res.redirect('/admin');
}

router.get('/', admin);
router.post('/updateAdmin', catchErrors(adminUpdate));

module.exports = router;
