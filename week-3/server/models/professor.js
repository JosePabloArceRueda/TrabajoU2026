const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    id_c: {
        required: true,
        type: Number
    },

    age: {
        required: true,
        type: Number
    }
})

professorSchema.index({id_c: 1}, {unique: true})




module.exports = mongoose.model('Professor', professorSchema)
