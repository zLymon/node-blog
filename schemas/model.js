var mongoose = require('mongoose');
var Schema = require('./schemas');
var UserSchema = Schema.userSchema
var ArticleSchema = Schema.articleSchema
var CommentSchema = Schema.commentSchema
var FieldWorkSchema = Schema.fieldWorkSchema
var ProjectSchema = Schema.projectSchema
//创建model，这个地方的test对应mongodb数据库中test的collection。
//mongoose会自动改成复数，如模型名：xx―>xxes, kitten―>kittens, money还是money
var UserModel = mongoose.model('administrators', UserSchema);
var ArticleModel = mongoose.model('articles', ArticleSchema)
var CommentModel = mongoose.model('comments', CommentSchema)
var FieldWorkModel = mongoose.model('FieldWorks', FieldWorkSchema)
var ProjectModel = mongoose.model('projects', ProjectSchema)
module.exports = {
    UserModel,
    ArticleModel,
    CommentModel,
    FieldWorkModel,
    ProjectModel
}