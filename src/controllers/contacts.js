import pino from 'pino';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import mongoose from 'mongoose';

const logger = pino();

export const getAllContactsController = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

    const filterOptions = { type, isFavourite };
    const { contacts, totalItems } = await getAllContacts(userId, Number(page), Number(perPage), sortBy, sortOrder, filterOptions);
    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: Number(page) > 1,
        hasNextPage: Number(page) < totalPages,
      },
    });
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    const contact = await getContactById(contactId, userId);
    if (!contact) {
      return next({ status: 404, message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    logger.error('Error fetching contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const createContactController = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const newContact = await createContact(req.body, userId);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    logger.error('Error creating contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    const updatedContact = await updateContact(contactId, req.body, userId);
    if (!updatedContact) {
      return next({ status: 404, message: 'Contact not found' });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: updatedContact,
    });
  } catch (error) {
    logger.error('Error updating contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next({ status: 400, message: 'Invalid contact ID' });
  }

  try {
    const deletedContact = await deleteContact(contactId, userId);
    if (!deletedContact) {
      return next({ status: 404, message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting contact:', error);
    next({ status: 500, message: 'Something went wrong' });
  }
};
