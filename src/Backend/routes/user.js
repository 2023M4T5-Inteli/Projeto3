const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('pirelli.db');

// Rota GET para obter todos os usuários
router.get('/', (req, res) => {
  const query = 'SELECT * FROM users';

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
  const query = 'SELECT * FROM users WHERE id = ?';
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
  const { nome, id_empresa, email, telefone, senha } = req.body;

  const query = 'INSERT INTO users (nome, id_empresa, email, telefone, senha) VALUES (?, ?, ?, ?, ?)';
  const values = [nome, id_empresa, email, telefone, senha];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating user' });
    }

    res.json({ id: this.lastID, nome, id_empresa, email, telefone, senha });
  });
});

// Rota PUT para atualizar um usuário existente
router.put('/:id', (req, res) => {
  const { nome, id_empresa, email, telefone, senha } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE users SET nome = ?, id_empresa = ?, email = ?, telefone = ?, senha = ? WHERE id = ?';
  const values = [nome, id_empresa, email, telefone, senha, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userId, nome, id_empresa, email, telefone, senha });
  });
});

// Rota DELETE para excluir um usuário
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';

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
