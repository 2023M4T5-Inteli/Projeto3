// Importando bibliotecas
#include <WiFi.h>
#include <PubSubClient.h>

//Adicionando credenciais de conexão
const char* ssid = "NOME REDE"; //Nome da rede wifi da empresa
const char* password = "SENHA REDE"; //Senha da rede wifi da empresa
const char* mqttServer = "broker.hivemq.com"; //Link do broker para comunicação MQTT
const int mqttPort = 1883; //Porta de comunicação MQTT
const char* mqttTopic = "rastreador/setor"; //Tópico em que a mensagem será publicada

WiFiClient espClient;
PubSubClient client(espClient);

//Função que prepara o ambiente e conexões para o escaneamento de redes e publicação no tópico MQTT
void setup() {
  Serial.begin(115200); // Inicializa a comunicação serial para exibir mensagens de depuração

  WiFi.begin(ssid, password); // Conecta à rede Wi-Fi
  while (WiFi.status() != WL_CONNECTED) { // Loop while para verificar se está conectado à internet
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi.");

  client.setServer(mqttServer, mqttPort); // Configura o cliente MQTT com o servidor e porta definidos

  while (!client.connected()) { // Tenta se conectar ao servidor MQTT
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado ao servidor MQTT.");
    } else {
      Serial.print("Falha na conexão com o servidor MQTT. Tentando novamente em 5 segundos..."); //Se não estiver conectado tenta novamente
      delay(5000);
    }
  }

  Serial.println("Iniciando escaneamento de redes Wi-Fi..."); //Printa que vai começar o escaneamento de redes
}
//
void loop() {
  int numNetworks = WiFi.scanNetworks(); // Escaneia as redes Wi-Fi disponíveis

  if (numNetworks == 0) {
    Serial.println("Nenhuma rede encontrada."); // Se nenhuma rede for encontrada printa essa frase
  } else { 
    int strongestSignalIndex = -1;
    int strongestSignalStrength = -999;

    for (int i = 0; i < numNetworks; i++) {
      String ssid = WiFi.SSID(i);

      if (ssid.indexOf("Setor") != -1) { // Verifica se o nome da rede contém a palavra "Setor"
        int signalStrength = WiFi.RSSI(i);
        if (signalStrength > strongestSignalStrength) { // Armazena a rede com o sinal mais forte
          strongestSignalIndex = i;
          strongestSignalStrength = signalStrength;
        }
      }
    }

    if (strongestSignalIndex != -1) { //Aqui verifica se alguma rede com esse nome foi encontrada
      String strongestNetwork = WiFi.SSID(strongestSignalIndex); //Guarda o nome da rede
      String macAddress = WiFi.macAddress(); //Guarda o MAC do ESP32

      Serial.print("Rede mais forte com 'Setor' no nome: ");
      Serial.println(strongestNetwork); //Printa a rede mais forte com Setor no nome
      Serial.print("Endereço MAC do ESP32: ");
      Serial.println(macAddress); // Printa o MAC do ESP32

      String payload = macAddress + ", " + strongestNetwork; //Junta esses dados em uma string
      publishMQTT(payload); // Publica as informações no servidor MQTT
    } else {
      Serial.println("Nenhuma rede com 'Setor' no nome encontrada."); // Se nenhuma rede com esse nome for encontrada printa essa frase
    }
  }

  delay(5000); // Aguarda 5 segundos antes de escanear novamente
}

void publishMQTT(String data) {
  if (!client.connected()) { // Se a conexão com o broker MQTT estiver perdida
    reconnectMQTT(); // Reconecta ao servidor MQTT se a conexão estiver perdida
  }

  char msg[100];
  data.toCharArray(msg, 100); // Converte string em data, pois essa função espera receber um array de caracteres como mensagem

  client.publish(mqttTopic, msg); // Publica a mensagem no tópico MQTT
  Serial.println("Mensagem publicada no tópico MQTT.");
}

void reconnectMQTT() {
  while (!client.connected()) { //Enquando a conexão com o broker MQTT estiver perdida
    if (client.connect("ESP32Client")) { // Se ele se conectar
      Serial.println("Conectado ao servidor MQTT."); // Printa essa frase
    } else { // Se não se conectar 
      Serial.print("Falha na conexão com o servidor MQTT. Tentando novamente em 5 segundos..."); // Printa eesa frase
      delay(5000); // Tenta novamente a cada 5 segundos
    }
  }
}