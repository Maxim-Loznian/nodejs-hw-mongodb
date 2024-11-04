import Contact from '../models/contact.js';

const getAllContacts = async (userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filterOptions = {}) => {
  const { type, isFavourite } = filterOptions;

  const query = { userId };

  if (type) {
    query.contactType = type;
  }

  if (isFavourite !== undefined) {
    query.isFavourite = isFavourite === 'true';
  }

  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const contacts = await Contact.find(query)
    .sort(sortOptions)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(query);

  return { contacts, totalItems };
};

const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

const createContact = async (contactData, userId) => {
  const contact = new Contact({ ...contactData, userId });
  return await contact.save();
};

const updateContact = async (contactId, updates, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updates,
    { new: true }
  );
};

const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};

export {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
