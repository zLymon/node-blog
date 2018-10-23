require('mongoose')
var marked = require('marked')
marked.setOptions({
    sanitize: true
})

var Model = require('../../schemas/model')
var ArticleModel = Model.ArticleModel
var CommentModel = Model.CommentModel
var FieldWorkModel = Model.FieldWorkModel
var ProjectModel = Model.ProjectModel
class Operation {
    getSummary(req,response) {
        function limitText(txt) {
            if(txt.length >= 114) {
                return txt.substr(0,114) + '...'
            } else {
                return txt
            }
        }
        // 去除文字外的标签
        function tagReplace(txt) {
            let tagReg = /<[^>]*>/g
            return txt.replace(tagReg, '')
        }
        ArticleModel.find((err,res) => {
            if(err) {
                console.log(err)
            }else {
                for(let i = 0; i < res.length; i++) {
                    res[i].content = marked(res[i].content)
                    res[i].content = tagReplace(res[i].content)
                    res[i].content = limitText(res[i].content)
                }
                response.json(res)
            }
        })
    }
    getArticle(req,res) {
        let id = req.query.id
        ArticleModel.findById({_id: id}, (err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: err
                })
            } else if(docs) {
                res.send({
                    status: 1,
                    message: docs
                })
            } else {
                return
            }
        })
    }
    getComment(req,response) {
        let id = req.body.id
        CommentModel.find({articleId: id}, (err, res) => {
            response.json(res)
        })
    }
    publishComment(req,res) {
        let visitor = new CommentModel({
            articleId: req.body.id,
            name: req.body.name,
            message: req.body.message,
            createTime: req.body.createTime
        })
        visitor.save((err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: err
                })
            } else {
                res.send({
                    status: 1,
                    message: '发表成功'
                })
            }
        })
    }
    getFieldWork(req, res) {
        FieldWorkModel.find((err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '获取失败'
                })
                return
            } else {
                res.json(docs)
            }
        })
    }
    getProject(req, res) {
        ProjectModel.find((err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '获取失败'
                })
                return
            } else {
                res.json(docs)
            }
        })
    }
    getSummaryByTag(req, res) {
        let tag = req.query.tag
        ArticleModel.find({tag: {$regex: tag}}, (err, docs) => {
        // ArticleModel.find({tag: tag}, (err, docs) => {
            if(err) {
                res.send(err)
            } else {
                res.send(docs)
            }
        })
    }
}

module.exports = new Operation()