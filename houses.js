const xss = require('xss');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');
const express = require('express');

const {
  insertRequest, select, update, selectHouse, selectEmployee, deleteRow,
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
  check('request')
    .isLength({ min: 1 })
    .withMessage('Ummæli mega ekki vera tóm'),
];

// Fylki af öllum hreinsunum fyrir nyskraningu
const sanitazions = [
  sanitize('request').trim().escape(),
  sanitizeXss('request'),
];

/**
 * Ósamstilltur route handler fyrir söluskrá.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function houses(req, res) {
  const list = await select();

  const data = {
    title: 'Aðalsíða',
    list,
  };

  return res.render('houses', data);
}

/*
 * Route handler fyrir form fasteignar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Formi fyrir umsókn
 */
async function house(req, res) {
  const { id } = await req.params;
  const housedata = await selectHouse(id);
  const employeedata = await selectEmployee(housedata.employees_id);

  const data = {
    title: 'Fasteign',
    house: housedata,
    employee: employeedata,
    request: '',
    errors: [],
    page: 'house',
  };
  res.render('house', data);
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
  const { id } = await req.params;
  const housedata = await selectHouse(id);
  const employeedata = await selectEmployee(housedata.employees_id);

  const {
    body: {
      request = '',
    } = {},
  } = req;

  const data = {
    title: 'Fasteign',
    house: housedata,
    employee: employeedata,
    request,
    errors: [],
    page: 'house',
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'Fyrirspurn/pöntun – vandræði';

    return res.render('house', data);
  }

  return next();
}

/**
 * Ósamstilltur route handler sem vistar gögn í gagnagrunni.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */

async function registerRequest(req, res) {
  const { id } = req.params;

  const {
    body: {
      request = '',
    } = {},
  } = req;

  const data = {
    id,
    request,
  };

  await insertRequest(data);

  return res.redirect(`/houses/${id}`);
}

/**
 * Ósamstilltur route handler sem selur fasteign.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/houses`
 */
async function sellHouses(req, res) {
  const { id } = req.body;

  await update(id);

  return res.redirect('/houses');
}


/**
 * Ósamstilltur route handler sem hendir fasteign.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/houses`
 */

async function deleteHouses(req, res) {
  const { id } = req.body;

  await deleteRow(id);

  return res.redirect('/houses');
}

router.get('/', catchErrors(houses));
router.get('/:id', catchErrors(house));
router.post('/update', catchErrors(sellHouses));
router.post('/delete', catchErrors(deleteHouses));

router.post(
  '/:id/request',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Öll gögn í lagi, hreinsa þau
  sanitazions,
  // Senda gögn í gagnagrunn
  catchErrors(registerRequest),
);

module.exports = router;
