import mqtt from 'mqtt';
import config from '../../config';

const mq = {};
const clientId = `qrder-server${  config.env !== 'production' ? `_${  config.env}` : ''}`;

mq.connected = false;
mq.clientId = clientId;
mq.client = mqtt.connect(`mqtt://${  config.mqtt.HOSTNAME}`, {
  clientId,
  username: config.mqtt.USERNAME,
  password: config.mqtt.PASSWORD,
  keepalive: 0,
});

mq.client.on('connect', () => {
  console.log(`🐇 Client is connected to MQTT broker as '${clientId}'`);
  mq.connected = true;
});

export default mq;