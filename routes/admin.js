var express = require('express')
var router = express.Router()
var User = require('../controller/admin/user')

router.get('/',function(req, res, next) {
    res.json({name: 'Lymon', pwd: '123'})
})

router.get('/getAllComment', User.getComment)
router.get('/getFieldWork', User.getFieldWork)
router.get('/getProject', User.getProject)
router.get('/getUpdateArticle', User.getUpdateArticle)

router.post('/register', User.register)
router.post('/publish', User.publish)
router.post('/login', User.login)
router.post('/deleteArticle', User.deleteArticle)
router.post('/deleteComment', User.deleteComment)
router.post('/addFieldWork', User.addFieldWork)
router.post('/addProject', User.addProject)
router.post('/deleteFieldWork', User.deleteFieldWork)
router.post('/deleteProject', User.deleteProject)
router.post('/updateArticle', User.updateArticle)

module.exports = router