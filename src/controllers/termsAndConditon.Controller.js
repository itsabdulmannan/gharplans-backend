const TermsConditions = require('../models/termAndCondition.Model');

exports.createTermsConditions = async (req, res) => {
  try {
    const terms = await TermsConditions.create(req.body);
    res.status(201).json(terms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllTermsConditions = async (req, res) => {
  try {
    const terms = await TermsConditions.findAll();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTermsConditionsById = async (req, res) => {
  try {
    const terms = await TermsConditions.findByPk(req.params.id);
    if (!terms) {
      return res.status(404).json({ message: 'Terms & Conditions not found' });
    }
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTermsConditions = async (req, res) => {
  try {
    const terms = await TermsConditions.findByPk(req.params.id);
    if (!terms) {
      return res.status(404).json({ message: 'Terms & Conditions not found' });
    }
    await terms.update(req.body);
    res.status(200).json(terms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTermsConditions = async (req, res) => {
  try {
    const terms = await TermsConditions.findByPk(req.params.id);
    if (!terms) {
      return res.status(404).json({ message: 'Terms & Conditions not found' });
    }
    await terms.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};