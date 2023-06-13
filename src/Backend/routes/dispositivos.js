const express = require('express'); // Importando o módulo Express
const sqlite3 = require('sqlite3'); // Importando o sqlite3 para usar o banco de dados sqlite

const router = express.Router();
const db = new sqlite3.Database('pirelli.db'); // Definindo "DataBase s pirelli.db"

// Rota GET para obter todos os dispositivos
router.get('/', (req, res) => {
  const query = 'SELECT * FROM dispositivos';

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching users' });
    }

    res.json(rows);
  });
});

// Rota GET para obter um dispositivo específico
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM dispositivos WHERE id = ?';
  const userId = req.params.id;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching user' });
    }

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(row);
  });
});

// Rota POST para criar um novo dispositivo
router.post('/', (req, res) => {
  const { setor, mac, ip } = req.body;

  const query = 'INSERT INTO dispositivos (setor, mac, ip) VALUES (?, ?, ?)';
  const values = [setor, mac, ip];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating user' });
    }

    res.json({ id: this.lastID, setor, mac, ip });
  });
});

// Rota PUT para atualizar um dispositivo existente
router.put('/:id', (req, res) => {
  const { setor, mac, ip } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE dispositivos SET setor = ?, mac = ?, ip = ? WHERE id = ?';
  const values = [setor, mac, ip, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userId, setor, mac, ip });
  });
});

// Rota DELETE para excluir um dispositivo
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM dispositivos WHERE id = ?';

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204);
  });
});

// Exportando as rotas
module.exports = router;
