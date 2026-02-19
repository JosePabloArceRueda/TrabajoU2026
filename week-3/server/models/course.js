const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    code: {
        required: true,
        type: String,
        unique: true
    },
    description: {
        required: true,
        type: String
    },
    id_professor: {
        required: true,
        type: Number,
        ref: 'Professor'
    },
    credits: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Course', courseSchema)