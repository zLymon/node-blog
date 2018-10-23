var express = require('express');
var router = express.Router();
var Operation = require('../controller/user/user')

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/getSummary', Operation.getSummary)
router.get('/getArticle', Operation.getArticle)
router.get('/getFieldWork', Operation.getFieldWork)
router.get('/getProject', Operation.getProject)
router.get('/getSummaryByTag', Operation.getSummaryByTag)

router.post('/publishComment', Operation.publishComment)
router.post('/getComment', Operation.getComment)

module.exports = router;
