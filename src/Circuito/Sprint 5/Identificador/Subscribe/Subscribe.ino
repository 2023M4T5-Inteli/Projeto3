 //Incluindo bibliotecas
#include <WiFi.h>
#include <PubSubClient.h>
 
 //////////////////////////////
 
 //    WIFI - MQTT SETUP     //
 
 //////////////////////////////
 
 
 //Credenciais da rede Wi-Fi para que o ESP32 consiga se conectar
 const char* ssid = "Wi-Fi"; //Nome da rede
 const char* password = "Password"; //Senha da rede
 WiFiClient espClient;
 
 //Credenciais do MQTT para que o ESP32 consiga ler mensagens no topico
 const char* mqtt_server = "MQTT Server"; //Servidor MQTT, pode ser um Broker online, mas nesse caso escolhemos Local Host
 const char* inTopic = "location/esp"; //Topico em que a mensagem foi publicada
 const char* clientName = "esp_1"; //Identificacao do ESP32 que sera conectado
 
 PubSubClient client(espClient);

 //////////////////////////////
 
 //          FUNCOES         //
 
 //////////////////////////////
 
//Funcao que conecta ao Wi-Fi
 void WiFiConnect() {
 
  Serial.print("Connecting to "); //Printa essa mensagem enquanto esta tentando conexao
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password); //Insere o nome e a senha da rede

  while (WiFi.status() != WL_CONNECTED) {  //Enquanto o Wi-Fi nao estiver conectado ficara printando "."
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected"); //Ao conectar printara essa mensagem
  Serial.println("IP address: "); //E printara o endereco de IPs
  Serial.println(WiFi.localIP()); //Printando o endereco de IP

 }
 
//Funcao que conecta ao MQTT
 void MQTTReconnect() {
 
  while(!client.connected()) {

    delay(500);
    Serial.println("Attempting MQTT reconnection"); //Printa essa mensagem enquanto esta tentando conexao

    if (client.connect(clientName)) {

      Serial.println("Connected to MQTT was successful"); //Ao conectar printara essa mensagem
      client.subscribe(inTopic);

    }
    else {  //Se a conexao falhar printara essas mensagens
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);

    }
  }

 }
 
 //Funcao que faz a inscricao no topico e recebe a mensagem
 void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived ["); //Ao receber uma mensagem printa isso
  Serial.print(topic); //Printa o topico
  Serial.print("] "); //Fecha o colchetes
  for (int i = 0; i < length; i++) { //Printa a mensagem
    Serial.print((char)payload[i]);
  }
  Serial.println();
 }
  
//Roda todas as configuracoes de ambiente
 void setup() {
 
  Serial.begin(115200);

  WiFiConnect();
  client.setServer(mqtt_server, 1883); //Tenta conectar no servidor usando a porta MQTT
  Serial.println("Connected to MQTT");
  client.setCallback(callback); //Ativa a funcao do callback e mostra a mensagem do subscribe
  
 }
 
 void loop() {
 
   if (!client.connected()) {
     MQTTReconnect();
   }
   delay(1000);
   client.loop();
 }
