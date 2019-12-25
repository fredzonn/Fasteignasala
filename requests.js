/* eslint-disable no-plusplus */
const express = require('express');

const {
  selectCheckIns, selectRequests, selectRequestById, selectHouse,
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

const router = express.Router();

/**
 * Ósamstilltur route handler fyrir fyrirspurnir og pantanir.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function requests(req, res) {
  const checkin = await selectCheckIns();
  const temp = await selectRequests();
  const id = await selectRequestById();
  // ids er fylki af id allra fasteigna sem innihalda fyrirspurn.
  const ids = id.map(x => x.house_id);

  const dataHouse = [];
  // Fyllum datahouse fylkið af öllum upplýsingum allra húsanna sem innihalda fyrirspurn.
  for (let i = 0; i < ids.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    dataHouse.push(await selectHouse(ids[i]));
  }

  const list = [];
  // Fyllum list af nöfnum, raðnúmeri og fyrirspurnum þeirra fasteigna sem innihalda fyrirspurnir.
  for (let i = 0; i < temp.length; i++) {
    const k = { name: dataHouse[i].name, house_id: temp[i].house_id, request: temp[i].request };
    list.push(k);
  }

  const data = {
    title: 'Fyrirspurnir & pantanir',
    checkin,
    list,
  };

  return res.render('requests', data);
}


router.get('/', catchErrors(requests));


module.exports = router;
