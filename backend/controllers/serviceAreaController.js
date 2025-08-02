const ServiceArea = require('../models/ServiceArea');

// Check if a postcode is serviceable
exports.checkServiceArea = async (req, res) => {
  const { postcode } = req.body;

  if (!postcode) {
    return res.status(400).json({ error: 'Postcode is required' });
  }

  try {
    const exists = await ServiceArea.findOne({ postcode });

    if (exists) {
      return res.json({ isServiceable: true });
    } else {
      return res.json({ isServiceable: false });
    }
  } catch (err) {
    console.error('Error checking service area:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin: View all serviceable postcodes
exports.getServiceAreas = async (req, res) => {
  const areas = await ServiceArea.find().sort({ postcode: 1 });
  res.json(areas);
};

// Admin: Add a new serviceable postcode
exports.addServiceArea = async (req, res) => {
  const { postcode } = req.body;

  if (!postcode) return res.status(400).json({ error: 'Postcode is required' });

  const exists = await ServiceArea.findOne({ postcode });
  if (exists) return res.status(400).json({ error: 'Postcode already exists' });

  const newArea = new ServiceArea({ postcode });
  await newArea.save();

  res.status(201).json({ message: 'Postcode added', area: newArea });
};
// Admin: Remove a serviceable postcode
exports.removeServiceArea = async (req, res) => {
  const { postcode } = req.body;

  if (!postcode) return res.status(400).json({ error: 'Postcode is required' });

  const deleted = await ServiceArea.findOneAndDelete({ postcode });
  if (!deleted) {
    return res.status(404).json({ error: 'Postcode not found' });
  }

  res.json({ message: 'Postcode removed', postcode });
};
