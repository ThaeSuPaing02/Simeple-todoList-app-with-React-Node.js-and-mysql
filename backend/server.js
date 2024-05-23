const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root3!@#',
  database: 'todo_app'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/api/todos', (req, res) => {
  connection.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      console.error('Error fetching To-Do items:', err);
      res.status(500).send('Error fetching To-Do items');
      return;
    }
    res.json(results);
  });
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  connection.query('INSERT INTO todos (text) VALUES (?)', [text], (err, result) => {
    if (err) {
      console.error('Error adding To-Do item:', err);
      res.status(500).send('Error adding To-Do item');
      return;
    }
    res.json({ id: result.insertId, text });
  });
});

// Serve static files from the React frontend
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// All other requests will be served by React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
