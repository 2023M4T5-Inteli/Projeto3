const express = require("express");
const sqlite3 = require("sqlite3");
const mqtt = require("mqtt");

const router = express.Router();
const db = new sqlite3.Database("pirelli.db");

const mqttServer = "broker.hivemq.com";
const mqttPort = 1883;
const mqttUser = "USUARIO_MQTT";
const mqttPassword = "SENHA_MQTT";
const mqttTopic = "rastreador/setor";

const mqttClient = mqtt.connect(`mqtt://${mqttServer}:${mqttPort}`, {
  username: mqttUser,
  password: mqttPassword,
});

mqttClient.on("connect", () => {
  console.log("Conectado ao servidor MQTT");

  mqttClient.subscribe(mqttTopic, (err) => {
    if (err) {
      console.error("Falha ao se inscrever no tópico MQTT:", err);
    } else {
      console.log("Inscrição no tópico MQTT realizada com sucesso.");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log("Mensagem recebida do tópico:", topic);
  console.log("Conteúdo da mensagem:", message.toString());

  const messageParts = message.toString().split(", ");
  const id_tablet = messageParts[0];
  const setor = messageParts[1];

  console.log(id_tablet);
  console.log(setor);

  if (setor == "Saiu da fábrica") {
    console.log("Dispositivo", id_tablet, "fora de conexão");
  } else {
    const query = "SELECT id FROM dispositivos WHERE mac = ?";
    db.get(query, [id_tablet], (err, row) => {
      if (err) {
        console.error(err);
        return console
          .status(500)
          .json({ error: "Error fetching access records" });
      }

      if (!row) {
        console.error("Tablet not found in the database");
        return console.status(404).json({ error: "Tablet not found" });
      }

      const tabletId = row.id;

      const insertQuery =
        "INSERT INTO rastreamento (setor, id_tablet, data_hora) VALUES (?, ?, datetime('now', 'localtime', '-3 hours'))";
      const insertValues = [setor, tabletId];

      db.run(insertQuery, insertValues, (err) => {
        if (err) {
          console.error(err);
          return console
            .status(500)
            .json({ error: "Error inserting tracking record" });
        }

        console.log("Registro de rastreamento inserido com sucesso");
      });
    });
  }
});

// Rota GET para obter o último setor de cada id_tablet
router.get("/ultimo-setor", (req, res) => {
  const query = `
    SELECT id_tablet, MAX(data_hora) AS ultima_data_hora, setor
    FROM rastreamento
    GROUP BY id_tablet
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error fetching last setor for each id_tablet" });
    }

    const ultimosSetores = rows.map((row) => ({
      id_tablet: row.id_tablet,
      setor: row.setor,
    }));

    res.json(ultimosSetores);
  });
});

// Rota GET para obter o último setor de cada id_tablet
router.get("/quantidade", (req, res) => {
  const query = `
    SELECT id_tablet, MAX(data_hora) AS data_hora, setor
    FROM rastreamento
    GROUP BY id_tablet
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Error fetching last setor for each id_tablet" });
    }

    // Processar os resultados para o gráfico de barras
    const setores = {};
    rows.forEach((row) => {
      const { id_tablet, setor } = row;
      if (setor in setores) {
        setores[setor].push(id_tablet);
      } else {
        setores[setor] = [id_tablet];
      }
    });

    const data = [];
    for (const setor in setores) {
      const quantidade = setores[setor].length;
      data.push({ setor, quantidade });
    }

    res.json(data);
  });
});

/*
  
  router.post("/registro-acesso", (req, res) => {
  const { tablet_id, funcionario_id } = req.body;

  // Verificar se existe algum registro anterior para o tablet_id e funcionario_id
  const query =
    "SELECT tipo_acesso FROM historico WHERE tablet_id = ? AND funcionario_id = ? ORDER BY data_hora DESC LIMIT 1";
  db.get(query, [tablet_id, funcionario_id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching access records" });
    }

    let tipo_acesso;
    if (row) {
      // Se já existe um registro anterior
      tipo_acesso = row.tipo_acesso === "entrada" ? "saida" : "entrada";
    } else {
      // Se é o primeiro registro para o tablet_id e funcionario_id
      tipo_acesso = "entrada";
    }

    // Inserir o novo registro de acesso no banco de dados
    const query =
      "INSERT INTO historico (tablet_id, funcionario_id, tipo_acesso, data_hora) VALUES (?, ?, ?, datetime('now', 'localtime'))";

    db.run(query, [tablet_id, funcionario_id, tipo_acesso], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error creating access record" });
      }

      // Enviar a informação de sucesso para o ESP32
      res.json({ success: true, tipo_acesso });
    });
  });
});
  
  
  const query =
    'INSERT INTO rastreamento (setor, id_tablet, data_hora) VALUES (?, ?, datetime("now", "localtime"))';

  const values = [setor, id_tablet];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('Dados inseridos no banco de dados com sucesso.');
    }
  });*/

/*
CREATE TABLE "rastreamento" (
	"id"	INTEGER NOT NULL,
	"setor"	TEXT NOT NULL,
	"id_tablet"	INTEGER NOT NULL,
	"data_hora"	datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_tablet") REFERENCES "dispositivos"("id")
);
*/
// Rota GET para obter todos os rastreios
router.get("/", (req, res) => {
  const query = "SELECT * FROM rastreamento";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching historico" });
    }

    res.json(rows);
  });
});

// Rota GET para obter um usuário específico
router.get("/:id", (req, res) => {
  const query = "SELECT id FROM dispositivos WHERE mac = ?";
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

// Rota POST para criar um novo usuário
router.post("/", (req, res) => {
  const { setor, id_tablet, data_hora } = req.body;

  const query =
    'INSERT INTO rastreamento (setor, id_tablet, data_hora) VALUES(?, ?,datetime("now", "localtime"))';

  const values = [setor, id_tablet, data_hora];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating user" });
    }

    res.json({
      id: this.lastID,
      setor,
      id_tablet,
      data_hora,
    });
  });
});

// Rota PUT para atualizar um usuário existente
router.put("/:id", (req, res) => {
  const { setor, id_tablet } = req.body;
  const userId = req.params.id;

  const query = "UPDATE rastreamento SET setor = ?, id_tablet = ? WHERE id = ?";
  const values = [setor, id_tablet, userId];

  db.run(query, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error updating user" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: userId,
      setor,
      id_tablet,
    });
  });
});

// Rota DELETE para excluir um usuário
router.delete("/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM rastreamento WHERE id = ?";

  db.run(query, [userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error deleting user" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.sendStatus(204);
  });
});

module.exports = router;
