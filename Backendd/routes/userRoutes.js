const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user by UID
router.get('/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create or Update User (Generic Profile)
router.post('/', async (req, res) => {
    const { uid, name, age, height, weight, gender, email } = req.body;

    if (!uid) {
        return res.status(400).json({ message: 'UID is required' });
    }

    try {
        let user = await User.findOne({ uid });

        if (user) {
            // Update existing user
            user.name = name || user.name;
            user.age = age || user.age;
            user.height = height || user.height;
            user.weight = weight || user.weight;
            user.gender = gender || user.gender;
            if (email) user.email = email;
        } else {
            // Create new user
            user = new User({
                uid,
                name,
                age,
                height,
                weight,
                gender,
                email
            });
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Diseases
router.post('/:uid/diseases', async (req, res) => {
    const { diseases } = req.body;

    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.diseases = diseases;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Disease Specific Profile
router.post('/:uid/disease-profile/:disease', async (req, res) => {
    const { disease } = req.params;
    const profileData = req.body;

    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize map if it doesn't exist (though Mongoose handles this)
        if (!user.diseaseProfiles) {
            user.diseaseProfiles = new Map();
        }

        user.diseaseProfiles.set(disease, profileData);
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save Plan
router.post('/:uid/plans', async (req, res) => {
    const { disease, planData, isLastPlan } = req.body;

    try {
        const user = await User.findOne({ uid: req.params.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (isLastPlan) {
            user.lastPlan = {
                disease,
                tdee: planData.tdee,
                macros: planData.macros,
                meals: planData.meals,
                workout: planData.workout,
                timestamp: Date.now()
            };
        } else {
            user.savedPlans.push({
                disease,
                planData,
                timestamp: Date.now()
            });
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
