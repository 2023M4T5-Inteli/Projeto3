 //Incluindo bibliotecas
 #include <WiFi.h>
 #include <PubSubClient.h>
 #include <Wire.h> 
 #include <LiquidCrystal_I2C.h>
 
 
 //////////////////////////////
 
 //    WIFI - MQTT SETUP     //
 
 //////////////////////////////
 
 
 //Credenciais da rede Wi-Fi para que o ESP32 consiga se conectar
 const char* ssid = "Wi-Fi"; //Nome da rede
 const char* password = "Password"; //Senha da rede
 WiFiClient espClient;
 
 
 //Credenciais do MQTT para que o ESP32 consiga criar e publicar mensagens no topico
 const char* mqtt_server = "MQTT Server"; //Servidor MQTT, pode ser um Broker online, mas nesse caso escolhemos Local Host
 const char* inTopic = "location/esp"; //Topico em que a mensagem sera publicada
 const char* clientName = "esp_2"; //Identificacao do ESP32 que sera conectado
 const char* mac = "40:22:D8:03:F4:E8"; //Mensagem que sera publicada, nesse caso escolhemos enviar o MAC do ESP32 para identificar o dispositivo
 
 PubSubClient client(espClient);
 
 // I2C
 LiquidCrystal_I2C lcd(0x27,16,2); //Adicao do Display para que vai mostrar a mensagem
 //////////////////////////////
 
 //          FUNCOES         //
 
 //////////////////////////////
 
//Funcao que conecta ao Wi-Fi
 void WiFiConnect() {
 
   Serial.print("Connecting to "); //Printa essa mensagem enquanto esta tentando conexao
   Serial.println(ssid);
 
   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, password); //Insere o nome e a senha da rede
 
   while (WiFi.status() != WL_CONNECTED) { //Enquanto o Wi-Fi nao estiver conectado ficara printando "."
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
     }
     else {  //Se a conexao falhar printara essas mensagens
         Serial.print("failed, rc=");
         Serial.print(client.state());
         Serial.println(" try again in 5 seconds");
         delay(5000);
      }
   }
 }
 
//Roda todas as configuracoes de ambiente
 void setup() {
 
   Serial.begin(115200);
   Wire.begin(21, 22);
   lcd.begin();
   lcd.backlight();
   
   WiFiConnect();
   client.setServer(mqtt_server, 1883); //Tenta conectar no servidor usando a porta MQTT
   Serial.println("Connected to MQTT");
 
 }
 
 void loop() {
 
   if (!client.connected()) {
     MQTTReconnect();
   }
   client.publish(inTopic, mac);//Publica o MAC no topico criado
   lcd.setCursor(3,0);
   lcd.print("Message Sent");//Printa a imagem no display
   Serial.println("Message Sent");//Sinaliza que a mensagem ja foi enviada
   delay(1000);
   lcd.clear();//Limpa o display
   client.loop();
 }
