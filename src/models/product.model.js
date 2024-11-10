import mongoose from 'mongoose';

const prodouctSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image:
  {
    type: String
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
});

const ProductModel = mongoose.model('Product', prodouctSchema);

export default ProductModel;