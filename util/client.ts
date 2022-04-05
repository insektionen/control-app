import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

const { MQTT_URL } = process.env;

type GlobalThis = {
  mqttClient?: mqtt.MqttClient;
};

export default function getClient(): MqttClient {
  if (!(globalThis as GlobalThis).mqttClient)
    (globalThis as GlobalThis).mqttClient = mqtt.connect('wss://server.insektionen.se/mqtt');
  return (globalThis as GlobalThis).mqttClient!;
}
