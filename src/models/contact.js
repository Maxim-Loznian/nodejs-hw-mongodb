// src/models/contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        default: 'personal',
        required: true,
    }
}, { timestamps: true, versionKey: false }); // versionKey: false вимикає поле __v

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
