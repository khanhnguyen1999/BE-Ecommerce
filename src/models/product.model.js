'use strict'

const { model, Schema } = require("mongoose");
const slugify = require("slugify")
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: Array,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

// defined the product type = clothing
const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
  {
    timestamps: true,
    collection: 'Clothes',
  }
)

// defined the product type = electronics
const electronicsSchema = new Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
  {
    timestamps: true,
    collection: 'Electronics',
  }
)

const furnitureSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
  {
    timestamps: true,
    collection: 'Furniture',
  }
)


module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothes: model('Clothes', clothingSchema),
  electronics: model('Electronics', electronicsSchema),
  furnitures: model('Furniture', furnitureSchema),
};
