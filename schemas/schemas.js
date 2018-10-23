var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    title:String,
    content:String,
    createTime:Date,
    tag:String
    // tags: [{
    //     type:String,
    //     default: ''
    // }]
    // tags: [{
    //     tag_name:{type: String, default: ''}
    // }]
});
var commentSchema = new Schema({
    articleId: String,
    name: String,
    message: String,
    createTime: Date
})
var userSchema = new Schema({
    username: String,
    pwd: String
})
var fieldWorkSchema = new Schema({
    time: String,
    company: String,
    desc: String,
    resp: String,
    link: String
})
var projectSchema = new Schema({
    time: String,
    name: String,
    desc: String,
    resp: String,
    link: String
})
module.exports = {
    userSchema,
    articleSchema,
    commentSchema,
    fieldWorkSchema,
    projectSchema
}