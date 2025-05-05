

import { 
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';
// import Item from '../models/Item';
import Item from '/Users/thiruchelvansibi/Desktop/history-website/backend/models/Item.js';

import express from 'express';
import { getAllItems } from '../controllers/itemController.js';

const router = express.Router();
// router.get('/', getAllItems);
router.get('/', getItems);
router.post('/', createItem);
router.get('/:id', getItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);



// CRUD Routes
// router.get('/', itemController.getItems);
// router.get('/items', getAllItems);
// router.get('/', itemController.getAllItems);
// router.post('/', itemController.createItem);
// router.get('/:id', itemController.getItem);
// router.put('/:id', itemController.updateItem);
// router.delete('/:id', async (req, res) => {
//     try {
//       // Method 1: Using deleteOne()
//       const result = await Item.deleteOne({ _id: req.params.id });
      
//       // Method 2: Or use findByIdAndDelete()
//       // const item = await Item.findByIdAndDelete(req.params.id);
  
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ message: "Item not found" });
//       }
      
//       res.json({ message: "Item deleted successfully" });
      
//     } catch (err) {
//       res.status(500).json({ 
//         message: err.message,
//         error: "Server error" 
//       });
//     }
//   });


// router.post('/', async (req, res) => {
//     try {
//       if (!req.body.name) {
//         return res.status(400).json({ error: "Name is required" });
//       }
  
//       const item = new Item({
//         name: req.body.name,
//         description: req.body.description // Will be undefined if not provided
//       });
  
//       const savedItem = await item.save();
//       res.status(201).json(savedItem);
      
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // router.get('/', async (req, res) => {
//   //   try {
//   //     const items = await Item.find();
//   //     res.json(items);
//   //   } catch (err) {
//   //     res.status(500).json({ message: err.message });
//   //   }
  // });
  export default router;
  // module.exports = router;