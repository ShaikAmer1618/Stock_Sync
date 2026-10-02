import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: 'Biryani'
    },

    sku: {
      type: String,
      required: true,
      unique: true
    },

    totalStock: {
      type: Number,
      default: 0
    },

    platformA: {
      type: Number,
      default: 0
    },

    platformB: {
      type: Number,
      default: 0
    },

    platformC: {
      type: Number,
      default: 0
    },

    masterEnabled: {
      type: Boolean,
      default: true
    },

    platformAEnabled: {
      type: Boolean,
      default: true
    },

    platformBEnabled: {
      type: Boolean,
      default: true
    },

    platformCEnabled: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      default: 'synced'
    },

    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Dish = mongoose.model('Dish', dishSchema);

export default Dish;