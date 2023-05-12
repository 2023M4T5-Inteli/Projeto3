// Used pins
#include <WiFi.h>
#define LEDPIN 4


const int redPort = 13;
const int greenPort = 12;
const int keyPort = 2;

// Button Press switch

int keyState;


// Create Unit class (Unit inside the factory)

class Unit {

  private:

    // Worker number inside unit

    int workers;
  
  public:

    // Name and unit coordinates

    String name;
    float coords[4][2];

    // Tracking switch

    bool trackingState;
    
    // Build units using constructor

    Unit(String _name, bool _trackingState) { // Add , float _coords[4][2]
      name = _name;
//      memcpy(coords, _coords, sizeof(coords));
      trackingState = _trackingState;
    }

    // Start / Stop tracking 

    void InitTracking(int keyPress) {
    if(keyPress) {
      
      trackingState = !trackingState;
      delay(1000);
    }
    if(trackingState) {
      
      digitalWrite(redPort, LOW);
      digitalWrite(greenPort, HIGH);
      delay(200);
      digitalWrite(greenPort, LOW);
      Serial.println("Tracking");
      delay(200);    
    }
    else{
      digitalWrite(greenPort, LOW);
      digitalWrite(redPort, HIGH);
      Serial.println("Not Tracking");
    }
  }

    // Check if usrCoords is in Unit (Cross-Product)

//     bool isInUnit(float usrLocation[2]) {
      
//       if(trackingState){
//         int i, j;
//         int count = 0;
//         double crossProduct;
//         int areaPoints = 4;

//         for (i = 0, j = areaPoints - 1; i < areaPoints; j = i++) {
//           if (
//             ((coords[i][1] > usrLocation[1]) != (coords[j][1] > usrLocation[1])) && 
//             (usrLocation[0] < (coords[j][0] - coords[i][0]) * (usrLocation[1] - coords[i][1]) / 
//             (coords[j][1] - coords[i][1]) + coords[i][0])
//             ) {count++;}
//         }

//           // If odd, usrCoords in location

//           bool stateToArea = count % 2 == 1;

//           // Return boolean value

//           return stateToArea; 
//       }
//       return false;
//     }
};


// Creating test unit *DEPOT*

Unit Depot("Depot 303", false); // add , {{40.690486, -74.045315},{40.690353, -74.046075},{40.689430, -74.045521},{40.689646, -74.044152}}

// Create test user Coordinates

// float usrCoords[2] = {40.689973, -74.045298};


void setup() {
  
  keyState = 0;

  pinMode(redPort, OUTPUT);
  pinMode(greenPort, OUTPUT);
  pinMode(keyPort, INPUT);

  Serial.begin(9600);

  pinMode(LEDPIN, OUTPUT);
  Serial.begin(9600);
  Serial.print("Conectando-se ao Wi-Fi");
  WiFi.begin("Wokwi-GUEST", "", 6);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Conectado!");
}

void loop() {
  keyState = digitalRead(keyPort);
  Depot.InitTracking(keyState);
  // Depot.isInUnit(usrCoords);


  if(WiFi.status() == WL_CONNECTED){
    digitalWrite(LEDPIN, HIGH);
  }
  else digitalWrite(LEDPIN, LOW);
}


