//Inclusão da biblioteca necessária para adicionar o sensor ultrassônico
#include "Ultrasonic.h" 
//Inclusão da biblioteca necessáaria para adicionar o teclado de membrana
#include <Keypad.h> 
//Inclusão da biblioteca necessária para adicionar o display de LCD
#include <LiquidCrystal_I2C.h> 
//Inclusão da biblioteca que possibilita a conexão wi-fi
#include <WiFi.h> 
#include <Wire.h>
//incluindo as bibliotecas necessárias para o rfid
#include <MFRC522.h>
#include <SPI.h>

//definindo novas portas para a comunicação I2C do display lcd
#define SDA_PIN 17
#define SCL_PIN 16

//definindo as portas para o rfid
#define SS_PIN    21
#define RST_PIN   22
#define SIZE_BUFFER     18
#define MAX_SIZE_BLOCK  16
//definindo as portas dos leds que indicam se o id identificado pelo rfid foi autorizado 
#define pinVerde     26
#define pinVermelho  27
//definindo porta do buzzer que toca ao autorizar 
//#define buzzer  12

//define a porta do led que acende para indicar a conexão wi-fi
const int led_wifi = 25; 
//Cria uma variável booleana para armazenar se o wi-fi está ligado ou não
bool conectadoWiFi = false;

//Inicializa o display no endereco 0x27
LiquidCrystal_I2C lcd(0x27,16,2);

//Define uma variável para armazenar o valor que verifica se a senha digitada está correta
int autorizado = 0;
//Define o numero de filas
const uint8_t ROWS = 4;
//Define o numero de colunas
const uint8_t COLS = 4;
//Define districuicao de teclas
char keys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
//Define os pinos de cada fila
uint8_t colPins[COLS] = { 4, 0, 2, 15 };
//Define os pinos de cada coluna
uint8_t rowPins[ROWS] = { 34, 16, 32, 35 };
//Cria um objeto com os parametros definidos acima
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

//Pino utilizado para conectar o Echo do sensor ultrassônico 
const int echoPin = 26;
//Pino ultilizado para conectar o Trig do sensor ultrassônico
const int trigPin = 25;
//Cria uma string para armazenar o texto digitado no teclado de membrana 
String texto;
//Define uma variável para identificar e armazenar a tecla selecionada
char tecla_press;
//Define uma porta para o buzzer
const int buzzer = 12;

//preparando o setup para o rfid
// Esse objeto 'chave' é utilizado para autenticação
MFRC522::MIFARE_Key key;
// Código de status de retorno da autenticação
MFRC522::StatusCode status;
// Definições do pino do módulo RC522
MFRC522 mfrc522(SS_PIN, RST_PIN);
// Definição da estrutura para armazenar dados do funcionário
struct Employee {
  String name;
  byte uid[4];
};
const int MAX_EMPLOYEES = 5;  
Employee employees[MAX_EMPLOYEES] = {
  {"Samuel", {0x11, 0x22, 0x33, 0x44}},
  {"Eu", {0xAA, 0xBB, 0xCC, 0xDD}},
  {"FUNCIONA P@#$$", {0x53, 0x7B, 0xB5, 0x1A}}
  // Adicione mais funcionários conforme necessário
};

//Iniciando as portas do sensor ultrassônico
Ultrasonic ultrasonic(trigPin,echoPin); 
//Definindo strings para armazenar as senhas
String ID_1 = "3689";
//Definindo strings para armazenar as senhas
String ID_2 = "1091";
//Definindo strings para armazenar as senhas
String ID_3 = "7853";
//Definindo uma variável para armazenar a distância
int distancia;
int n_dispositivo;

void hcsr04(){
    //Define o pulso do pino como low
    digitalWrite(trigPin, LOW); 
    delayMicroseconds(2);
    //Define o pulso do pino como high
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    //Define o pulso do pino como low
    digitalWrite(trigPin, LOW); 
    //Variável que recebe o valor identificado pelo sensor ultrassônico
    distancia = (ultrasonic.Ranging(CM)); 
    delay(100);
 }

void ler_teclado(){
  tecla_press = keypad.getKey();
  if(tecla_press != '#'){
    texto += String(tecla_press);
  }
}

  //Função para conectar o microcontrolador ao wi-fi 
void conectarWiFi() {
  //Imprime no monitor serial que o microcontrolador está se conectando a rede wi-fi 
  Serial.print("Conectando ao WiFi...");
  //Define o nome e a senha da red 
    //WiFi.begin("SSID", "SENHA");
  WiFi.begin("Enya", "eunaosei");
  //O while existe para que enquanto estiver conectando apareça "." no monitor serial
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    //Quando o wi-fi é conectado, o led é aceso
    Wire.begin(SDA_PIN, SCL_PIN);
    lcd.setBacklight(HIGH);
    lcd.setCursor(0, 0);
    //Imprime no display LCD que o wi-fi foi conectado
    lcd.print("WiFi conectado");
    lcd.setCursor(0, 1);
    //Após a conexão wi-fi, imprime no display LCD para a senha ser digitada
    lcd.print("Digite sua senha:");
    //Após a conexão, o led que indica o status da rede é ligado
    digitalWrite(led_wifi, HIGH);
    delay(2000);
    //Limpa o display LCD
    lcd.clear();
  }
  // Exibe a mensagem de conexão bem sucedida e atualiza a variável conectadoWiFi
  Serial.println("Conectado ao WiFi com sucesso!");
  conectadoWiFi = true;
}

void setup(){
  lcd.init();
  //Definindo pinos como entrada ou saída
  pinMode(led_wifi, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(echoPin, INPUT); 
  pinMode(trigPin, OUTPUT); 
  pinMode(pinVerde, OUTPUT);
  pinMode(pinVermelho, OUTPUT);
  pinMode(buzzer, OUTPUT);
  Serial.begin(9600); 
  //Inicializa o barramento SPI
  SPI.begin(); 
  pinMode(pinVerde, OUTPUT);
  pinMode(pinVermelho, OUTPUT);
  pinMode(buzzer, OUTPUT);
  mfrc522.PCD_Init();
  conectarWiFi();
  }
void loop(){
  //Acende o led se o wifi estiver conectado
  if (conectadoWiFi) {
    digitalWrite(led_wifi, HIGH);
    //Deixa o led desligado se o wi-fi não estiver conectado
  } else {
    digitalWrite(led_wifi, LOW);
  }

  //Chamando o método "hcsr04()"
  hcsr04(); 
  ler_teclado();
  lcd.setBacklight(HIGH);
  
    // Aguarda a aproximação do cartão
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  // Seleciona um dos cartões
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }
  leituraDados();
  // Instrui o PICC, quando no estado ACTIVE, a ir para um estado de "parada"
  mfrc522.PICC_HaltA();
  // "Stop" a encriptação do PCD, deve ser chamado após a comunicação com autenticação,
  // caso contrário novas comunicações não poderão ser iniciadas
  mfrc522.PCD_StopCrypto1();

}

void leituraDados() {
  // Imprime os detalhes técnicos do cartão/tag
  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid));
  // Prepara a chave - todas as chaves estão configuradas para FFFFFFFFFFFFh (Padrão de fábrica)
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  // Buffer para colocar os dados lidos
  byte buffer[SIZE_BUFFER] = {0};
  // Bloco em que faremos a operação
  byte bloco = 1;
  byte tamanho = SIZE_BUFFER;
  // Faz a autenticação do bloco em que vamos operar
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, bloco, &key, &(mfrc522.uid)); // linha 834 do arquivo MFRC522.cpp
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Falha na autenticação: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    autorizado = 0;
    return;
  }
  // Faz a leitura dos dados do bloco
  status = mfrc522.MIFARE_Read(bloco, buffer, &tamanho);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Falha na leitura: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  } 

  Serial.print(F("\nDados do bloco ["));
  Serial.print(bloco);
  Serial.print(F("]: "));
  // Imprime os dados lidos
  for (uint8_t i = 0; i < MAX_SIZE_BLOCK; i++) {
    Serial.write(buffer[i]);
  }
  Serial.println(" ");
  // Verificação do UID
  bool uidVerified = false;
  for (int i = 0; i < MAX_EMPLOYEES; i++) {
    if (memcmp(employees[i].uid, mfrc522.uid.uidByte, 4) == 0) {
      uidVerified = true;
      autorizado = 1;
      Serial.println("Funcionário encontrado: " + employees[i].name);
      digitalWrite(pinVerde, HIGH);
      digitalWrite(buzzer, HIGH);
      delay(1000);
      digitalWrite(buzzer, LOW);
      digitalWrite(pinVerde, LOW);
      break;
    }
  }
  if (!uidVerified) {
    Serial.println("UID inválido");
    digitalWrite(pinVermelho, HIGH);
    delay(1000);
    digitalWrite(pinVermelho, LOW);
  }

if(autorizado == 1){
    lcd.setCursor(0, 0);
    //Imprime no display LCD que o wi-fi foi conectado
    lcd.print("N° do dispositivo:");
    lcd.clear();
  }
  
  else{
    autorizado = 0;
  }

  if(tecla_press){
    n_dispositivo = tecla_press;
  }
}