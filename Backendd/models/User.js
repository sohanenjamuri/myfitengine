const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    email: String,
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    diseases: {
        type: [String],
        default: []
    },
    // Store disease specific profiles. Keyed by disease name (e.g., 'pcos', 'diabetes')
    diseaseProfiles: {
        type: Map,
        of: new mongoose.Schema({
            name: String,
            age: Number,
            height: Number,
            weight: Number,
            gender: String,
        }, { _id: false, strict: false }) // strict: false allows extra fields if needed
    },
    // Saved plans
    savedPlans: [{
        disease: String,
        timestamp: { type: Number, default: Date.now },
        planData: mongoose.Schema.Types.Mixed
    }],
    // Last generated plan (for quick access/resuming)
    lastPlan: {
        disease: String,
        tdee: Number,
        macros: mongoose.Schema.Types.Mixed,
        meals: mongoose.Schema.Types.Mixed,
        workout: mongoose.Schema.Types.Mixed,
        timestamp: { type: Number, default: Date.now }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
