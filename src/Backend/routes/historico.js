const express = require("express");
const sqlite3 = require("sqlite3");

const router = express.Router();
const db = new sqlite3.Database("pirelli.db");

router.get("/", (req, res) => {
  const query = `
    SELECT *
    FROM historico
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching historico" });
    }

    res.json(rows);
  });
});

// Rota GET para obter todos os historicos
router.get("/com-nome", (req, res) => {
  const query = `
    SELECT historico.*, funcionarios.nome
    FROM historico
    JOIN funcionarios ON historico.id_funcionario = funcionarios.id_empresa
  `;
  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching historico" });
    }

    res.json(rows);
  });
});

// Rota GET para obter um historico específico
router.get("/:id", (req, res) => {
  const query = "SELECT * FROM historico WHERE id = ?";
  const userId = req.params.id;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching user" });
    }

    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(row);
  });
});

// Rota POST para criar um novo historico
router.post("/", (req, res) => {
  const { id_funcionario, id_tablet, tipo_acesso, data_hora } = req.body;

  const query =
    'INSERT INTO historico (id_funcionario, id_tablet, tipo_acesso, data_hora) VALUES(?, ?, ?,datetime("now", "localtime", "-3 hours"))';

  const values = [id_funcionario, id_tablet, tipo_acesso, data_hora];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating user" });
    }

    res.json({
      id: this.lastID,
      id_funcionario,
      id_tablet,
      tipo_acesso,
      data_hora,
    });
  });
});

// Rota PUT para atualizar um historico existente
router.put("/:id", (req, res) => {
  const { id_funcionario, id_tablet, tipo_acesso } = req.body;
  const userId = req.params.id;

  const query =
    "UPDATE historico SET id_funcionario = ?, id_tablet = ?, tipo_acesso = ? WHERE id = ?";
  const values = [id_funcionario, id_tablet, tipo_acesso, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error updating historico" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Historico not found" });
    }

    res.json({
      id: userId,
      id_funcionario,
      id_tablet,
      tipo_acesso,
    });
  });
});

// Rota DELETE para excluir um historico
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM historico WHERE id = ?";

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting historico" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Historico not found" });
    }

    res.sendStatus(204);
  });
});

// Rota POST para registrar o acesso
router.post("/registro-acesso", (req, res) => {
  const { id_tablet, id_funcionario } = req.body;

  // Verificar se existe algum registro anterior para o tablet_id e funcionario_id
  const query =
    "SELECT tipo_acesso FROM historico WHERE id_tablet = ? AND id_funcionario = ? ORDER BY data_hora DESC LIMIT 1";
  db.get(query, [id_tablet, id_funcionario], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching access records" });
    }

    let tipo_acesso;
    if (row) {
      // Se já existe um registro anterior
      tipo_acesso = row.tipo_acesso === "retirada" ? "devolução" : "retirada";
    } else {
      // Se é o primeiro registro para o tablet_id e funcionario_id
      tipo_acesso = "retirada";
    }

    // Inserir o novo registro de acesso no banco de dados
    const query =
      "INSERT INTO historico (id_tablet, id_funcionario, tipo_acesso, data_hora) VALUES (?, ?, ?, datetime('now', 'localtime', '-3 hours'))";

    db.run(query, [id_tablet, id_funcionario, tipo_acesso], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating access record" });
      }

      // Enviar a informação de sucesso para o ESP32
      res.json({ success: true, tipo_acesso });
    });
  });
});

module.exports = router;
