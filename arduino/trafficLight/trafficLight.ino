#include <Wire.h>
 
#define SLAVE_ADDRESS 0x04

enum phases {
 red, redChanging, green, amber
};

phases phase, nextPhase;
unsigned long lightsTimer = 0;

void setup() {
  Wire.begin(SLAVE_ADDRESS);
  Wire.onReceive(receiveData);
  Wire.onRequest(sendData);
  phase = red;
  // put your setup code here, to run once:
  for(int i=8;i<=10;i++) {
    pinMode(i, OUTPUT);
    digitalWrite(i,HIGH);
  }
}

void loop() {
  phaseChange();
}

void phaseChange() {
  if(millis() >= lightsTimer) {
    phase = nextPhase;
    switch(phase) {
      case red:
        digitalWrite(8, LOW);
        digitalWrite(9, HIGH);
        digitalWrite(10, HIGH);
        nextPhase = redChanging;
        lightsTimer = millis() + 10000UL;
        break;
      case redChanging:
        digitalWrite(8, LOW);
        digitalWrite(9, LOW);
        digitalWrite(10, HIGH);
        nextPhase = green;
        lightsTimer = millis() + 3000UL;
        break;
      case amber:
        digitalWrite(8, HIGH);
        digitalWrite(9, LOW);
        digitalWrite(10, HIGH);
        nextPhase = red;
        lightsTimer = millis() + 5000UL;
        break;
      case green:
        digitalWrite(8, HIGH);
        digitalWrite(9, HIGH);
        digitalWrite(10, LOW);
        nextPhase = amber;
        lightsTimer = millis() + 10000UL;
        break;
      default:
        digitalWrite(8, HIGH);
        digitalWrite(9, HIGH);
        digitalWrite(10, HIGH);
      break;
    }
  }
}

void receiveData(int byteCount){
  while(Wire.available()) {
    int receivedPhase = Wire.read();
    if(receivedPhase >= 0 && receivedPhase <= 3) {
      nextPhase = receivedPhase;
      lightsTimer = 0UL;
    }
  }
}
 
// callback for sending data
void sendData(){
 Wire.write(phase);
}

