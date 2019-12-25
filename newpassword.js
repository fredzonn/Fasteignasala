const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');
const bcrypt = require('bcrypt');

const {
  findByUsername, findByEmail, updatePassword, findUser,
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

// Fylki af öllum validations fyrir umsókn
const validations = [
  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),

  check('email')
    .custom(async (value) => {
      const email = await findByEmail(value);
      if (!email) {
        // throw error ef netfang er ekki til
        throw new Error('Netfang er ekki til');
      } else {
        return value;
      }
    }),

  check('username')
    .isLength({ min: 1 })
    .withMessage('Notendanafn má ekki vera tómt'),

  check('username')
    .custom(async (value) => {
      const user = await findByUsername(value);
      if (!user) {
        // throw error ef notendanafn er ekki til
        throw new Error('Notendanafn er ekki til');
      } else {
        return value;
      }
    }),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Lykilorð verður að vera að minnsta kosti 8 stafir'),


  check('safety')
    .isLength({ min: 1 })
    .withMessage('Öryggissvar má ekki vera tómt'),
];

// Fylki af öllum hreinsunum fyrir nyskraningu
const sanitazions = [

  sanitizeXss('email'),
  sanitize('email').trim().normalizeEmail(),

  sanitize('username').trim().escape(),
  sanitizeXss('username'),

  sanitizeXss('password'),
  sanitize('password').trim().escape(),

  sanitizeXss('passwordConfirm'),
  sanitize('passwordConfirm').trim().escape(),

  sanitizeXss('safety'),
  sanitize('safety').trim().escape(),

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
    title: 'Nýtt lykilorð',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    security: '',
    safety: '',
    errors: [],
    page: 'newpassword',
  };
  res.render('newpassword', data);
}

/**
 * Route handler sem athugar stöðu á nýju lykilorði og birtir villur ef einhverjar,
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
      email = '',
      username = '',
      password = '',
      passwordConfirm = '',
      security = '',
      safety = '',
    } = {},
  } = req;

  const data = {
    email,
    username,
    password,
    passwordConfirm,
    security,
    safety,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'Nýtt lykilorð – vandræði';

    return res.render('newpassword', data);
  }

  return next();
}

/**
 * Ósamstilltur route handler sem vistar nýtt lykilorð í gagnagrunn og sendir
 * á innskráningarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */

async function newPassword(req, res) {
  // athugum hvort það sé til notandi sem passar við upplýsingarnar
  const user = await findUser({
    email: req.body.email,
    username: req.body.username,
    security: req.body.security,
    safety: req.body.safety,
  });
  if (!user) {
    // throw error ef upplýsingar stemmnast ekki
    throw new Error('Upplýsingar eru ekki réttar', req.body.email);
  } else {
    // annars uppfærum við lykilorð notanda með hashuðu passwordi
    await bcrypt.hash(req.body.password, 10, (err, hash) => {
      updatePassword({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        passwordConfirm: hash,
        security: req.body.security,
        safety: req.body.safety,
      }).then((data) => {
        if (data) {
          res.redirect('/newpassword/reset');
        }
      });
    });
  }
}


/**
 * Route handler fyrir lykilorði breytt.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function reset(req, res) {
  return res.render('reset', { title: 'Lykilorði breytt', page: 'newpassword' });
}

router.get('/', form);
router.get('/reset', reset);

router.post(
  '/',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Öll gögn í lagi, hreinsa þau
  sanitazions,
  // Senda gögn í gagnagrunn
  catchErrors(newPassword),
);

module.exports = router;
