const xss = require('xss');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');
const express = require('express');

const {
  select, insertCheckin, selectUsers,
} = require('./db');

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
   * Hjálparfall sem XSS hreinsar reit í formi eftir heiti.
   *
   * @param {string} fieldName Heiti á reit
   * @returns {function} Middleware sem hreinsar reit ef hann finnst
   */

function sanitizeXss(fieldName) {
  return (req, res, next) => {
    if (!req.body) {
      next();
    }

    const field = req.body[fieldName];

    if (field) {
      req.body[fieldName] = xss(field);
    }

    next();
  };
}

const router = express.Router();

// Fylki af öllum validations fyrir fyrirspurn.
const validations = [
  check('day')
    .isLength({ min: 1 })
    .withMessage('Dagssetning verður að vera valin'),

  check('day')
    .matches(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/)
    .withMessage('Dagssetning verður að vera á tilskyldu formi'),

];

// Fylki af öllum hreinsunum fyrir nyskraningu
const sanitazions = [
  sanitize('request').trim().escape(),
  sanitizeXss('request'),
];

/*
 * Route handler fyrir form pöntunar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Formi fyrir umsókn
 */
async function checkIn(req, res) {
  const list = await select();

  const data = {
    title: 'Panta tíma',
    house: '',
    day: '',
    time: '',
    list,
    errors: [],
    page: 'checkin',
  };
  res.render('checkin', data);
}

/**
   * Route handler sem athugar stöðu á fyrirspurnum og birtir villur ef einhverjar,
   * sendir annars áfram í næsta middleware.
   *
   * @param {object} req Request hlutur
   * @param {object} res Response hlutur
   * @param {function} next Næsta middleware
   * @returns Næsta middleware ef í lagi, annars síðu með villum
   */
async function showErrors(req, res, next) {
  const list = await select();

  const {
    body: {
      house = '',
      day = '',
      time = '',
    } = {},
  } = req;

  const data = {
    house,
    day,
    time,
    list,
    errors: [],
    page: 'checkIn',
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'Fyrirspurn/pöntun – vandræði';

    return res.render('checkin', data);
  }

  return next();
}

/**
 * Ósamstilltur route bætir við tímapöntun í gangagrunn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/houses`
 */
async function checkinOrder(req, res) {
  const users = await selectUsers();
  const {
    body: {
      house = '',
      day = '',
      time = '',
    } = {},
  } = req;

  const data = {
    users,
    house,
    user: req.user.name,
    day,
    time,
  };

  await insertCheckin(data);

  return res.redirect('/checkIn/thanks2');
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks2(req, res) {
  return res.render('thanks2', { title: 'Pöntun móttekin', page: 'checkIn' });
}

router.get('/', catchErrors(checkIn));
router.get('/thanks2', thanks2);

router.post(
  '/insertCheckin',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Öll gögn í lagi, hreinsa þau
  sanitazions,
  // Senda gögn í gagnagrunn
  catchErrors(checkinOrder),
);

module.exports = router;
