import { mqtt } from '../lib/clients';
import { getUuidFromToken } from '../lib/utils';

import restaurant from './restaurant';

export const initializeTopics = () => {
  mqtt.client.subscribe('restaurant/#', (err) => {
    if (err) {
      console.log('[error]:', err);
      
    }
  });

  mqtt.client.on('message', (topic, message) => {
    // console.log(`[${topic}]: ${message}`);
    try {
      const parsed = topic.split('/');

      const args = {
        topic,
        message: JSON.parse(message),
        credentials: {
          type: parsed[0],
          token: parsed.slice(1).join('.'),
          uuid: getUuidFromToken(parsed.slice(1).join('.'))
        }
      };

      if (args.credentials.type === 'restaurant') {
        restaurant.run(args);
      }
    } catch {
      console.log(`[${topic}]: ${message}`);
    }
  });
}