const PrivacyPolicy = require('../models/privacyAndPolicy.Model');

exports.createPrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.create(req.body);
    res.status(201).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPrivacyPolicies = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.findAll();
    res.status(200).json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrivacyPolicyById = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByPk(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByPk(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }
    await policy.update(req.body);
    res.status(200).json(policy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findByPk(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }
    await policy.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};