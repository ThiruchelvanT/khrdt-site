// const mongoose = require('mongoose');

// const itemSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   image: String, // URL to an image
//   link: String,   // Link for the department
// });

// const Item = mongoose.model('Item', itemSchema);
// export default Item;

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String, // URL to an image
  link: String,   // Link for the department
});

export default mongoose.model('Item', itemSchema);