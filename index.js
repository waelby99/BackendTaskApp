const express = require('express');
const { MongoClient,ObjectId  } = require('mongodb');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const app = express();
const port = 5000;
const storage = multer.memoryStorage(); // Store files in memory as Buffer

app.use(express.json({ limit: '10mb' }));  // Increase the limit to 10MB

// Multer setup for file handling with a file size limit of 10MB
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
const uri = process.env.MONGODB_URI;
let db;

// MongoDB connection setup
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('tasks'); // Use your database name
    console.log('Connected to MongoDB');
  })
  .catch(error => console.error(error));

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to get tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Endpoint to add a new task
app.post('/tasks', upload.array('files'), async (req, res) => {
  try {
    console.log('Received files:', req.files); // Check received files

    const newTask = {
      text: req.body.text,
      due_date: req.body.due_date,
      priority: req.body.priority,
      status: req.body.status,
    };

    // Process files if they exist
    if (req.files && req.files.length > 0) {
      newTask.files = req.files.map(file => ({
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer // Storing in memory (or save to disk)
      }));
    }

    const result = await db.collection('tasks').insertOne(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({
      message: 'Error adding task',
      error: err.message
    });
  }
});

// Add this near your other endpoints (after /tasks POST and before app.listen)

// Endpoint to get a single task by ID
app.get('/tasks/:taskId', async (req, res) => {
  try {
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(req.params.taskId) });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If the task has a file, include it in the response
    if (task.file) {
      res.json({
        ...task,
        file: {
          filename: task.file.filename,
          contentType: task.file.contentType,
        },
      });
    } else {
      res.json(task);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Endpoint to delete a task
app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(req.params.taskId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Endpoint to update a task
app.put('/tasks/:taskId', upload.single('file'), async (req, res) => {
  try {
    console.log('Received body:', req.body);  // Task data
    console.log('Received file:', req.file);  // File data

    const taskUpdate = {
      text: req.body.text,
      due_date: req.body.due_date,
      priority: req.body.priority,
      status: req.body.status,
    };

    // If a file was uploaded, update the task with the new file data
    if (req.file) {
      taskUpdate.file = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      };
    }

    // Update the task in the database
    const result = await db.collection('tasks').updateOne(
        { _id: new ObjectId(req.params.taskId) },
        { $set: taskUpdate }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error during task update:', err);
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});