const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('pirelli.db');

// Rota GET para obter todos os usuários
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

// Rota GET para obter um usuário específico
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

// Rota POST para criar um novo usuário
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

// Rota PUT para atualizar um usuário existente
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

// Rota DELETE para excluir um usuário
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

module.exports = router;
