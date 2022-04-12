import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
type GlobalThis = {
  mqttClient?: mqtt.MqttClient;
};

export default function getClient(): MqttClient {
  if (!(globalThis as GlobalThis).mqttClient)
    (globalThis as GlobalThis).mqttClient = mqtt.connect(publicRuntimeConfig.mqttURL);
  return (globalThis as GlobalThis).mqttClient!;
}
