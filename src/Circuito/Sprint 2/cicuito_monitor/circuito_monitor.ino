//Inclusão da biblioteca necessária para adicionar o sensor ultrassônico
#include "Ultrasonic.h" 
//Inclusão da biblioteca necessáaria para adicionar o teclado de membrana
#include <Keypad.h> 
//Inclusão da biblioteca necessária para adicionar o display de LCD
#include <LiquidCrystal_I2C.h> 
//Inclusão da biblioteca que possibilita a conexão wi-fi
#include <WiFi.h> 

//define a porta do led que acende para indicar a conexão wi-fi
const int led_wifi = 19; 
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
uint8_t rowPins[ROWS] = { 18, 5, 17, 16 };
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

//Iniciando as portas do sensor ultrassônico
Ultrasonic ultrasonic(trigPin,echoPin); 
//Definindo strings para armazenar as senhas
String ID_1 = "3689";
//Definindo strings para armazenar as senhas
String ID_2 = "1091";
//Definindo strings para armazenar as senhas
String ID_3 = "7853";~
//Definindo uma variável para armazenar a distância
int distancia; 

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
  Serial.begin(9600); 
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
  
  //Se a tecla enter("#") for pressionada e a senha digitada for correta, imprime que a pessoa foi autorizada
  if(tecla_press == '#'){
    if(texto == ID_1 || texto == ID_2 || texto == ID_3){
      lcd.setCursor(0,1);
      lcd.print("Autorizado");
      autorizado = 1;
    }
    //Se a tecla enter("#") for pressionada e a senha digitada for errada, imprime que a pessoa foi negada
    else{
      lcd.setCursor(0,1);
      lcd.print("Negado");
      delay(2000);
      texto = "";
      autorizado = 0;
      lcd.clear();

    }
    //Se a tecla apagar("*") for pressionada, limpa o que foi imprimido no LCD e a variavel que guarda o texto 
  } else if (tecla_press == '*'){
    texto = "";
    autorizado = 0;
    lcd.clear();
  }
  //Se a variável "autorizada" tiver valor 1 e a distancia identificada pelo sensor ultrassônico for = 2, o buzzer toca e reinicia a variavel que verifica se está autorizado
  if(distancia == 2 && autorizado == 1){
    digitalWrite(buzzer, HIGH);
    delay(200);
    digitalWrite(buzzer, LOW);
    Serial.print("Distancia ");
    Serial.print(distancia);
    Serial.println("cm"); 
    texto = "";
    autorizado = 0;
    lcd.clear();
  }
  lcd.setCursor(0, 0);
  lcd.print(texto);
  //Serial.println(texto);
  //Serial.println(distancia);
  delay(100);
  hcsr04();

}
