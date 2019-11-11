const express = require('express');

const { selectEmployees } = require('./db');

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const router = express.Router();

/**
 * Ósamstilltur route handler fyrir starfsfólk.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function employees(req, res) {
  const list = await selectEmployees();

  const data = {
    title: 'Sölumenn',
    list,
  };

  return res.render('employees', data);
}

router.get('/', catchErrors(employees));


module.exports = router;
