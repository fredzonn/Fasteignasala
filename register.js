const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');
const bcrypt = require('bcrypt');

const { insertUser } = require('./db');

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

// Fylki af öllum validations fyrir umsókn
const validations = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),

  check('username')
    .isLength({ min: 1 })
    .withMessage('Notendanafn má ekki vera tómt'),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Lykilorð verður að vera að minnsta kosti 8 stafir'),

  check('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        // throw error ef lykilorð passa ekki
        throw new Error('Lykilorð verða að vera eins');
      } else {
        return value;
      }
    }),
];

// Fylki af öllum hreinsunum fyrir nyskraningu
const sanitazions = [

  sanitize('name').trim().escape(),
  sanitizeXss('name'),

  sanitizeXss('email'),
  sanitize('email').trim().normalizeEmail(),

  sanitize('username').trim().escape(),
  sanitizeXss('username'),

  sanitizeXss('password'),
  sanitize('password').trim().escape(),

  sanitizeXss('passwordConfirm'),
  sanitize('passwordConfirm').trim().escape(),

];

/**
 * Route handler fyrir form umsóknar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Formi fyrir umsókn
 */
function form(req, res) {
  const data = {
    title: 'Nýskráning',
    name: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    errors: [],
  };
  res.render('register', data);
}

/**
 * Route handler sem athugar stöðu á umsókn og birtir villur ef einhverjar,
 * sendir annars áfram í næsta middleware.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 * @returns Næsta middleware ef í lagi, annars síðu með villum
 */
function showErrors(req, res, next) {
  const {
    body: {
      name = '',
      email = '',
      username = '',
      password = '',
      passwordConfirm = '',
    } = {},
  } = req;

  const data = {
    name,
    email,
    username,
    password,
    passwordConfirm,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'Nýskráning – vandræði';

    return res.render('register', data);
  }

  return next();
}

/**
 * Ósamstilltur route handler sem vistar gögn í gagnagrunn og sendir
 * á þakkarsíðu
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */

async function registerPost(req, res) {
  await bcrypt.hash(req.body.password, 10, (err, hash) => {
    insertUser({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hash,
      passwordConfirm: hash,
    }).then((data) => {
      if (data) {
        res.redirect('/register/thanks1');
      }
    });
  });
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks1(req, res) {
  return res.render('thanks1', { title: 'Nýskráning tókst', page: 'register' });
}

router.get('/', form);
router.get('/thanks1', thanks1);

router.post(
  '/',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Öll gögn í lagi, hreinsa þau
  sanitazions,
  // Senda gögn í gagnagrunn
  catchErrors(registerPost),
);

module.exports = router;
