const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
};

// Helper function to write data
const writeData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw error;
  }
};

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await readData();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const items = await readData();
    const item = items.find(item => item.id === parseInt(req.params.id));
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create new item
app.post('/api/items', async (req, res) => {
  try {
    const items = await readData();
    const { name, description, price, image, category } = req.body;
    
    // Validation
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }
    
    // Create new item
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      name,
      description,
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: category || 'Electronics',
      inStock: true,
      rating: 0
    };
    
    // Add to array and save
    items.push(newItem);
    await writeData(items);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});