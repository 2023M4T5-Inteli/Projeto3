// Importando bibliotecas
#include <WiFi.h>

//Adicionando credenciais de conexão
const char* Wifi_ssid = "Inteli-COLLEGE"; //Nome da rede wifi da empresa
const char* Wifi_password = "QazWsx@123"; //Senha da rede wifi da empresa
//Adicionando credenciais do roteador que será criado
const char* Apssid = "Nome/Número do Setor"; //Coloque alguma identificação do setor aqui, o nome presente aqui será o nome exibido no dashboard
const char* Appassword = "Senha"; //Crie uma senha, não se preocupe não precisará lembrá-la

//Função que prepara o ambiente
void setup() {
  Serial.begin(115200); // Inicializa a comunicação serial para exibir mensagens de depuração
  delay(500);
  WiFi.mode(WIFI_AP_STA); // Alterando o modo de wifi do ESP para AP + STATION

  WiFi.softAP(Apssid, Appassword); // Iniciando ponto de acesso com as credenciais fornecidas
  IPAddress myIP = WiFi.softAPIP(); // Endereço IP do nosso ponto de acesso Esp32
  Serial.print("Endereço IP do ponto de acesso: ");
  Serial.println(myIP);
  
  Serial.println("");

  delay(1500);
  Serial.println("Conectando ao WiFi...");
  Serial.println(Wifi_ssid); //Printa no terminal o nome da rede em que está tentando se conectar

  WiFi.begin(Wifi_ssid, Wifi_password); // Conecta à rede Wi-Fi
  while (WiFi.status() != WL_CONNECTED) { // Loop while para verificar se está conectado à internet
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }

  Serial.println("");
  Serial.println("Conectado ao WiFi.");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());            // Conexão bem-sucedida do Esp32,
                                            // Imprimindo o IP local fornecido pelo seu roteador ou ponto de acesso móvel
  Serial.println("");

}

void loop() {
}
  // Coloque seu código principal aqui, para ser executado continuamente:

