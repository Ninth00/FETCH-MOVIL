// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'n0m3l0',
  database: 'tareas_db',
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
});

// Obtener todas las tareas
app.get('/tareas', (req, res) => {
  db.query('SELECT * FROM tareas', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Agregar una tarea
app.post('/tareas', (req, res) => {
  const { titulo } = req.body;
  db.query('INSERT INTO tareas (titulo) VALUES (?)', [titulo], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Actualizar una tarea
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;
  db.query('UPDATE tareas SET titulo = ? WHERE id = ?', [titulo, id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
