const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();
const db = new sqlite3.Database('pirelli.db');

// Rota GET para obter todos os usuários
router.get('/', (req, res) => {
  const query = 'SELECT * FROM historico';

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching historico' });
    }

    res.json(rows);
  });
});

// Rota GET para obter um usuário específico
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM historico WHERE id = ?';
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
//const query = 'INSERT INTO historico (id_funcionario, id_tablet, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)';
 
// Rota POST para criar um novo usuário
router.post('/', (req, res) => {
  const { id_funcionario, id_tablet, data_emprestimo, data_devolucao } = req.body;
  
  const query = 'INSERT INTO historico (id_funcionario, id_tablet, data_emprestimo, data_devolucao) VALUES(?, ?, datetime("now"),datetime("now", "localtime"))';

  const values = [id_funcionario, id_tablet, data_emprestimo, data_devolucao];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error creating user' });
    }

    res.json({ id: this.lastID, id_funcionario, id_tablet, data_emprestimo, data_devolucao });
  });
});

// Rota PUT para atualizar um usuário existente
router.put('/:id', (req, res) => {
  const { id_funcionario, id_tablet, data_emprestimo, data_devolucao } = req.body;
  const userId = req.params.id;

  const query = 'UPDATE historico SET id_funcionario = ?, id_tablet = ?, data_emprestimo = ?, data_devolucao = ? WHERE id = ?';
  const values = [id_funcionario, id_tablet, data_emprestimo, data_devolucao, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userId, id_funcionario, id_tablet, data_emprestimo, data_devolucao });
  });
});

// Rota DELETE para excluir um usuário
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM historico WHERE id = ?';

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
