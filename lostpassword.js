/* eslint-disable no-console */
const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

const nodemailer = require('nodemailer');

const { findByEmail } = require('./db');

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

// Fylki af öllum validations fyrir netfangið
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
        // throw error ef email er ekki til
        throw new Error('Netfang ekki á skrá');
      } else {
        return value;
      }
    }),
];

// Fylki af hreinsun netangs
const sanitazions = [
  sanitizeXss('email'),
  sanitize('email').trim().normalizeEmail(),
];

/**
 * Route handler fyrir týnt lykilorð.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Formi fyrir netfang
 */
function form(req, res) {
  const data = {
    title: 'Týnt lykilorð',
    email: '',
    errors: [],
    page: 'lostpassword',
  };
  res.render('lostpassword', data);
}

/**
 * Route handler sem athugar stöðu á týndu lykilorði og birtir villur ef einhverjar,
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
    } = {},
  } = req;

  const data = {
    email,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'Týnt lykilorð – vandræði';

    return res.render('lostpassword', data);
  }

  return next();
}

/**
 * Ósamstilltur route handler sem leitar af emaili í gagnagrunni
 * og sendir á emailið.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */

async function lostPassword(req, res) {
  await findByEmail(req.body.email);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: 'eafasteignir@gmail.com',
      pass: 'ealokaverkefni1',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const HelperOptions = {
    from: '"EA Fasteignir" <eafasteignir@gmail.com>',
    to: req.body.email,
    subject: 'Týnt lykilorð',
    text: 'Til að setja nýtt lykilorð, farðu inn á http://127.0.0.1:7777/newpassword',
  };

  // eslint-disable-next-line consistent-return
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('The message was sent!');
    console.log(info);
  });
  res.redirect('/houses');
}

/**
 * Route handler fyrir upplýsingar um nýtt lykilorð.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function checkEmail(req, res) {
  return res.render('checkEmail', { title: 'Nýtt lykilorð', page: 'email' });
}

router.get('/', form);
router.get('/checkemail', checkEmail);

router.post(
  '/',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Öll gögn í lagi, hreinsa þau
  sanitazions,
  // Senda gögn í gagnagrunn
  catchErrors(lostPassword),
);

module.exports = router;
