require('mongoose')
var marked = require('marked')
marked.setOptions({
    sanitize: true
})
var Model = require('../../schemas/model')
var UserModel = Model.UserModel
var ArticleModel = Model.ArticleModel
var CommentModel = Model.CommentModel
var FieldWorkModel = Model.FieldWorkModel
var ProjectModel = Model.ProjectModel
class User {
    register(req, res) {
        let user = new UserModel({
            username: req.body.username,
            pwd: req.body.pwd
        })
        UserModel.findOne({username: user.username}, (err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: err
                })
            } else if(docs) {
                res.send({
                    status: -1,
                    message: '账号已存在'
                })
            } else {
                user.save((err) => {
                    if(err) {
                        console.log(err)
                        return
                    } else {
                        res.send({
                            status: 1,
                            message: '注册成功'
                        })
                    }
                })
            }
        })
    }
    login(req, res) {
        let user = new UserModel({
            username: req.body.username,
            pwd: req.body.pwd
        })
        
        UserModel.findOne({username: user.username, pwd: user.pwd}, (err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: err
                })
            } else if(docs) {
                // 如果账号存在，则创建session
                req.session._id = docs._id
                res.send({
                    status: 1,
                    data: docs._id,
                    message: '登录成功'
                })
            } else {
                res.send({
                    status: -1,
                    message: '账号或密码错误'
                })
            }
        })
    }
    publish(req, res) {
        // 1. 前端发送的内容是markdown格式的文本
        // 2. 将其转换成HTML格式的文本，并获取h1标签的内容作为标题
        let titleReg = /<h1[^>]*>([\w-\W]+)<\/h1>/
        let html = marked(req.body.content)
        let title = html.match(titleReg)[1]
        
        let article = new ArticleModel({
            title: title,
            content: req.body.content,
            createTime: req.body.createTime,
            tag: req.body.tag
            // tags: tags.map(name => name)
        })
        article.save((err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: err
                })
            } else {
                res.send({
                    status: 1,
                    message: '发布文章成功'
                })
            }
        })
    }
    getComment(req, response) {
        CommentModel.find((err, res) => {
            response.json(res)
        })
    }
    deleteArticle(req, res) {
        let id = req.body.id
        try {
            ArticleModel.findOneAndRemove({_id: id}, (err) => {
                if(err) {
                    res.send({
                        status: -1,
                        message: '删除文章失败'
                    })
                    return
                } else {
                    CommentModel.findOneAndRemove({articleId: id}, (err) => {
                        if(err) {
                            res.send({
                                status: -1,
                                message: '删除评论失败'
                            })
                            return
                        } else {
                            res.send({
                                status: 1,
                                message: '删除成功'
                            })
                        }
                    })
                }
            })
        } catch (error) {
            console.log(err)
            return
        }
    }
    deleteComment(req, res) {
        let id = req.body.id
        CommentModel.remove({_id: id}, (err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '删除失败'
                })
            } else {
                res.send({
                    status: 1,
                    message: '删除成功'
                })
            }
        })
    }
    addFieldWork(req, res) {
        let fieldWork = new FieldWorkModel({
            time: req.body.time,
            company: req.body.company,
            desc: req.body.desc,
            resp: req.body.resp,
            link: req.body.link
        })
        fieldWork.save((err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '添加失败'
                })
                return
            } else {
                res.send({
                    status: 1,
                    message: '添加成功'
                })
            }
        })
    }
    addProject(req, res) {
        let project = new ProjectModel({
            time: req.body.time,
            name: req.body.name,
            desc: req.body.desc,
            resp: req.body.resp,
            link: req.body.link
        })
        project.save((err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '添加失败'
                })
                return
            } else {
                res.send({
                    status: 1,
                    message: '添加成功'
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
    deleteFieldWork(req, res) {
        let id = req.body.id
        FieldWorkModel.remove({_id: id}, (err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '删除失败'
                })
            } else {
                res.send({
                    status: 1,
                    message: '删除成功'
                })
            }
        })
    }
    deleteProject(req, res) {
        let id = req.body.id
        ProjectModel.remove({_id: id}, (err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '删除失败'
                })
            } else {
                res.send({
                    status: 1,
                    message: '删除成功'
                })
            }
        })
    }
    getUpdateArticle(req, res) {
        let articleId = req.query.id
        console.log(articleId)
        ArticleModel.findById({_id: articleId}, (err, docs) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '获取文章失败'
                })
            } else if(docs) {
                res.send({
                    status: 1,
                    message: docs
                })
            } else {
                res.send({
                    status: -1,
                    message: '未知错误'
                })
            }
        })
    }
    updateArticle(req, res) {
        let titleReg = /<h1[^>]*>([\w-\W]+)<\/h1>/
        let html = marked(req.body.content)
        let title = html.match(titleReg)[1]
        
        ArticleModel.findByIdAndUpdate({_id: req.body.id},{title: title,content: req.body.content,tag:req.body.tag}, (err) => {
            if(err) {
                res.send({
                    status: -1,
                    message: '更新失败'
                })
            } else {
                res.send({
                    status: 1,
                    message: '更新成功'
                })
            }
        })
        // article.
        // article.save((err) => {
        //     if(err) {
        //         res.send({
        //             status: -1,
        //             message: err
        //         })
        //     } else {
        //         res.send({
        //             status: 1,
        //             message: '发布文章成功'
        //         })
        //     }
        // })
    }
}

module.exports = new User()