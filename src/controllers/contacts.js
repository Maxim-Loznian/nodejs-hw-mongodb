const createHttpError = require('http-errors');
const Contact = require('../models/Contact');

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const newContact = new Contact({
      name,
      email,
      phone,
      userId: req.user.id,
    });

    await newContact.save();

    res.status(201).json({
      status: 'success',
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });

    res.status(200).json({
      status: 'success',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findOne({ _id: contactId, userId: req.user.id });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 'success',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
};
