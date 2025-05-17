import Item from '../models/Item.js';

// Get all items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Create a new item
// exports.createItem = async (req, res) => {
//   const item = new Item({
//     name: req.body.name,
//     description: req.body.description
//   });

//   try {
//     const newItem = await item.save();
//     res.status(201).json(newItem);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

export const createItem = async (req, res) => {
    try {
      const item = new Item(req.body);
      const savedItem = await item.save();
      console.log("Saved item:", savedItem); // Verify save worked
      res.status(201).json(savedItem); // 👈 Send response back
    } catch (err) {
      res.status(400).json({ error: err.message }); // 👈 Error response
    }
  };

// Get a single item
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an item
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (req.body.name != null) item.name = req.body.name;
    if (req.body.description != null) item.description = req.body.description;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.remove();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};