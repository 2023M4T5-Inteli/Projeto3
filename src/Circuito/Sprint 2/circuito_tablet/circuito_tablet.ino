//Inclusão da biblioteca que possibilita a conexão wi-fi
#include <WiFi.h>

// Declara as váriaveis para referir aos leds, e define seus pinos
const int led_verde = 14;
const int led_amarelo = 12;

// Define variáveis para armazenar o estado atual do botão e da conexão WiFi
int estadobotao = 0;
bool conectadoWiFi = false;

void setup() {
  // Configura os pinos dos LEDs e do botão como saída ou entrada
  pinMode(led_verde, OUTPUT);
  pinMode(led_amarelo, OUTPUT);
  Serial.begin(9600);

  // Conecta-se ao WiFi
  conectarWiFi();
}

void loop() {
  // Controla o led amarelo
  if (conectadoWiFi) {
    digitalWrite(led_amarelo, HIGH);
  } else {
    digitalWrite(led_amarelo, LOW);
  }

  delay(100);
}

void conectarWiFi() {
  // Conecta-se ao WiFi
  // Acende o led verde para indicar que o circuito está funcionando
  digitalWrite(led_verde, HIGH);
  Serial.print("Conectando ao WiFi...");
  WiFi.begin("iPhone de Mariana", "12345678");
  //WiFi.begin("SSID", "SENHA");

  // Aguarda a conexão imprimindo no monitor serial "..."
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  // Exibe a mensagem de conexão bem sucedida e atualiza a variável conectadoWiFi
  Serial.println("Conectado ao WiFi com sucesso!");
  conectadoWiFi = true;
}