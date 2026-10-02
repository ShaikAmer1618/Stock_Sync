import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Dish from './models/Dish.js';
// import { createServer as createViteServer } from 'vite';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(function() {
    console.log('MongoDB connected successfully');
  })
  .catch(function(error) {
    console.error('MongoDB connection failed:', error.message);
  });

const app = express();
const PORT = process.env.PORT || 3000;

// Standard MERN Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder
app.use('/assets', express.static(path.join(process.cwd(), 'hackethon/Frontend/public/assets')));
app.use(express.static(path.join(process.cwd(), 'hackethon/Frontend/public')));

// 15 Food dishes with live portion counts and verified authentic food item images
const initialFoodInventory = [
  // Biryanis
  {
    id: 1,
    name: 'Hyderabadi Chicken Dum Biryani',
    category: 'Biryani',
    sku: 'BIR-CHK-001',
    totalStock: 50,
    platformA: 20, // Swiggy
    platformB: 20, // Zomato
    platformC: 10, // Direct
    status: 'synced',
    image: '/assets/food/hyderabadi-chicken-biryani.jpg'
  },
  {
    id: 2,
    name: 'Special Mutton Dum Biryani',
    category: 'Biryani',
    sku: 'BIR-MUT-002',
    totalStock: 35,
    platformA: 15,
    platformB: 12,
    platformC: 8,
    status: 'synced',
    image: '/assets/food/special-mutton-biryani.jpg'
  },
  {
    id: 3,
    name: 'Chicken 65 Biryani',
    category: 'Biryani',
    sku: 'BIR-65-003',
    totalStock: 25,
    platformA: 10,
    platformB: 10,
    platformC: 5,
    status: 'synced',
    image: '/assets/food/chicken-65-biryani.jpg'
  },
  {
    id: 4,
    name: 'Egg Dum Biryani',
    category: 'Biryani',
    sku: 'BIR-EGG-004',
    totalStock: 5,
    platformA: 2, // Low stock: trigger safety delist
    platformB: 2, // Low stock: trigger safety delist
    platformC: 1, // Critical stock: trigger safety delist
    status: 'low',
    image: '/assets/food/egg-dum-biryani.jpg'
  },

  // Starters
  {
    id: 5,
    name: 'Chicken 65 (Crispy & Spicy)',
    category: 'Starter',
    sku: 'STR-C65-005',
    totalStock: 40,
    platformA: 18,
    platformB: 14,
    platformC: 8,
    status: 'synced',
    image: '/assets/food/chicken-65.jpg'
  },
  {
    id: 6,
    name: 'Chilli Chicken Dry',
    category: 'Starter',
    sku: 'STR-CCD-006',
    totalStock: 30,
    platformA: 12,
    platformB: 12,
    platformC: 6,
    status: 'synced',
    image: '/assets/food/chilli-chicken-dry.jpg'
  },
  {
    id: 7,
    name: 'Chicken Majestic',
    category: 'Starter',
    sku: 'STR-MAJ-007',
    totalStock: 22,
    platformA: 10,
    platformB: 8,
    platformC: 4,
    status: 'synced',
    image: '/assets/food/chicken-majestic.jpg'
  },
  {
    id: 8,
    name: 'Tandoori Chicken (Full)',
    category: 'Starter',
    sku: 'STR-TAN-008',
    totalStock: 5,
    platformA: 2, // triggers ghost protection
    platformB: 2, // triggers ghost protection
    platformC: 1, // triggers ghost protection
    status: 'low',
    image: '/assets/food/tandoori-chicken.jpg'
  },
  {
    id: 9,
    name: 'Mutton Seekh Kebab',
    category: 'Starter',
    sku: 'STR-MSK-009',
    totalStock: 18,
    platformA: 8,
    platformB: 6,
    platformC: 4,
    status: 'synced',
    image: '/assets/food/mutton-seekh-kebab.jpg'
  },
  {
    id: 10,
    name: 'Mutton Boti Kebab',
    category: 'Starter',
    sku: 'STR-MBK-010',
    totalStock: 4,
    platformA: 2, // triggers ghost protection
    platformB: 1, // triggers ghost protection
    platformC: 1, // triggers ghost protection
    status: 'low',
    image: '/assets/food/mutton-boti-kebab.jpg'
  },

  // Chicken Curries
  {
    id: 11,
    name: 'Butter Chicken Masala',
    category: 'Chicken Curry',
    sku: 'CUR-BCM-011',
    totalStock: 28,
    platformA: 12,
    platformB: 10,
    platformC: 6,
    status: 'synced',
    image: '/assets/food/butter-chicken-masala.jpg'
  },
  {
    id: 12,
    name: 'Andhra Chicken Curry',
    category: 'Chicken Curry',
    sku: 'CUR-ACC-012',
    totalStock: 32,
    platformA: 14,
    platformB: 12,
    platformC: 6,
    status: 'synced',
    image: '/assets/food/andhra-chicken-curry.jpg'
  },
  {
    id: 13,
    name: 'Kadai Chicken Gravy',
    category: 'Chicken Curry',
    sku: 'CUR-KCG-013',
    totalStock: 20,
    platformA: 8,
    platformB: 8,
    platformC: 4,
    status: 'synced',
    image: '/assets/food/kadai-chicken-gravy.jpg'
  },

  // Mutton Curries
  {
    id: 14,
    name: 'Mutton Rogan Josh',
    category: 'Mutton Curry',
    sku: 'CUR-MRJ-014',
    totalStock: 15,
    platformA: 6,
    platformB: 6,
    platformC: 3,
    status: 'synced',
    image: '/assets/food/mutton-rogan-josh.jpg'
  },
  {
    id: 15,
    name: 'Hyderabadi Mutton Korma',
    category: 'Mutton Curry',
    sku: 'CUR-HMK-015',
    totalStock: 3,
    platformA: 1, // triggers ghost protection
    platformB: 1, // triggers ghost protection
    platformC: 1, // triggers ghost protection
    status: 'low',
    image: '/assets/food/mutton-korma.jpg'
  }
];

app.post('/api/inventory/seed', async (req, res) => {
  try {
    await Dish.deleteMany({});

    const dishes = await Dish.insertMany(initialFoodInventory);

    res.json({
      success: true,
      message: '15 dishes added to MongoDB',
      count: dishes.length,
      dishes: dishes
    });
  } catch (error) {
    console.error('Seed error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


const CATEGORY_DEFAULTS = {
  'Biryani': '/assets/food/hyderabadi-chicken-biryani.jpg',
  'Starter': '/assets/food/chicken-65.jpg',
  'Chicken Curry': '/assets/food/butter-chicken-masala.jpg',
  'Mutton Curry': '/assets/food/mutton-rogan-josh.jpg',
  'Dessert': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80',
  'Default': '/assets/food/hyderabadi-chicken-biryani.jpg'
};

let foodInventory = JSON.parse(JSON.stringify(initialFoodInventory));

// 1. Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StockSync Backend is running',
    timestamp: new Date().toISOString()
  });
});

// 2. Inventory Dishes API Route (GET)
app.get('/api/inventory', async (req, res) => {
  try {
    const dishes = await Dish.find();

    res.json({
      success: true,
      totalCount: dishes.length,
      dishes: dishes,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get inventory error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 3. Add New Dish API Route (POST)
app.post('/api/inventory', async (req, res) => {
  try {
    const newDish = req.body;

    if (!newDish || !newDish.name) {
      return res.status(400).json({
        success: false,
        error: 'Dish name is required'
      });
    }

    const createdDish = new Dish({
      name: newDish.name,
      category: newDish.category || 'Biryani',
      sku: newDish.sku || `DSH-${Date.now()}`,
      totalStock: Number(newDish.totalStock) || 0,
      platformA: Number(newDish.platformA) || 0,
      platformB: Number(newDish.platformB) || 0,
      platformC: Number(newDish.platformC) || 0,
      status: (Number(newDish.totalStock) || 0) <= 10 ? 'low' : 'synced',
      image:
        (newDish.image && newDish.image.trim()) ||
        CATEGORY_DEFAULTS[newDish.category] ||
        CATEGORY_DEFAULTS['Default']
    });

    const savedDish = await createdDish.save();

    res.status(201).json({
      success: true,
      message: 'Dish added successfully',
      dish: savedDish
    });

  } catch (error) {
    console.error('Add dish error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. Reset Inventory to clean default state (POST)
app.post('/api/inventory/reset', async (req, res) => {
  try {
    await Dish.deleteMany({});

    const dishes = await Dish.insertMany(initialFoodInventory);

    res.json({
      success: true,
      message: 'Inventory reset successfully',
      totalCount: dishes.length,
      dishes: dishes
    });

  } catch (error) {
    console.error('Reset inventory error:', error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 4. Update Inventory Stock API (PATCH)
// Update Inventory Stock + Channel Status
app.patch('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      totalStock,
      platformA,
      platformB,
      platformC,
      status,
      masterEnabled,
      platformAEnabled,
      platformBEnabled,
      platformCEnabled
    } = req.body;

    const updateData = {};

    if (totalStock !== undefined) {
      updateData.totalStock = Number(totalStock);
    }

    if (platformA !== undefined) {
      updateData.platformA = Number(platformA);
    }

    if (platformB !== undefined) {
      updateData.platformB = Number(platformB);
    }

    if (platformC !== undefined) {
      updateData.platformC = Number(platformC);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (masterEnabled !== undefined) {
      updateData.masterEnabled = Boolean(
        masterEnabled
      );
    }

    if (platformAEnabled !== undefined) {
      updateData.platformAEnabled = Boolean(
        platformAEnabled
      );
    }

    if (platformBEnabled !== undefined) {
      updateData.platformBEnabled = Boolean(
        platformBEnabled
      );
    }

    if (platformCEnabled !== undefined) {
      updateData.platformCEnabled = Boolean(
        platformCEnabled
      );
    }

    const updatedDish =
      await Dish.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedDish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      dish: updatedDish
    });
  } catch (error) {
    console.error(
      'Update inventory error:',
      error.message
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StockSync Backend running on http://localhost:${PORT}`);
});








// // Serve the React frontend through Express
// async function startServer() {
//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }

//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`StockSync Server running on http://localhost:${PORT}`);
//   });
// }

// startServer();
