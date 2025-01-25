const mongoose = require('mongoose');
const User = require('./User');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    subtitle: {
        type: String
    },
    markdownContent: {
        type: Object,
    },
    attachmentFile: {
        type: String,
    },
    url: {
        type: String,
        unique: true
    },
    selectedAuthor:{
        type:String,   
    },
    createdBy: {
        type: String,
    },
    createdAt: {
        type: String,
       
    },
    modifiedBy: {
        type: String,
    },
    modifiedAt: {
        type: String,
    },
    status: {
        type: String,
        default :'Draft'
    },
    publishTime:{
        type:String,
        default:''
    },
    email:{
        type:String
    }
});

const Blog = mongoose.model('blogs', blogSchema);

module.exports = Blog;
