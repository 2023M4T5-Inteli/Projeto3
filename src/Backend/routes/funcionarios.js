const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('pirelli.db');

// Rota GET para obter todos os funcionarios
router.get('/', (req, res) => {
  const query = 'SELECT * FROM funcionarios';

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching funcionarios' });
    }

    res.json(rows);
  });
});

// Rota GET para obter um funcionario específico
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM funcionarios WHERE id = ?';
  const userId = req.params.id;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching func' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Func not found' });
    }

    res.json(row);
  });
});

// Rota POST para criar um novo funcionario
router.post('/', (req, res) => {
  const { nome, id_empresa, email, telefone } = req.body;

  const query = 'INSERT INTO funcionarios (nome, id_empresa, email, telefone) VALUES (?, ?, ?, ?)';
  const values = [nome, id_empresa, email, telefone];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating func' });
    }

    res.json({ id: this.lastID, nome, id_empresa, email, telefone });
  });
});

// Rota PUT para atualizar um funcionario existente
router.put('/:id', (req, res) => {
  const { nome, id_empresa, email, telefone } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE funcionarios SET nome = ?, id_empresa = ?, email = ?, telefone = ? WHERE id = ?';
  const values = [nome, id_empresa, email, telefone, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating func' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Func not found' });
    }

    res.json({ id: userId, nome, id_empresa, email, telefone });
  });
});

// Rota DELETE para excluir um funcionario
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM funcionarios WHERE id = ?';

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting func' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Func not found' });
    }

    res.sendStatus(204);
  });
});

// Exportando as rotas definidas
module.exports = router;
