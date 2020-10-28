# Structures

## MQTT Message

```js
  const topic = `client/${token}` || `restaurant/${token}`;

  const RestaurantwithServer = `restaurant/${token}/server`;
  const RestaurantwithClient = `restaurant/${token}/client`;
```

```js
  const message_opcode = {
    type: 0 || 1, // 0 = server, 1 = client
    opcode: 'customerArrived' || 'newOrder' || 'modifyOrder',
    args: {

    }
  };

  const message_result = {
    type: 0 || 1, // 0 = server, 1 = client
    opcode: 'customerArrived' || 'newOrder' || 'modifyOrder',
    res: {

    }
  };
```

```js
  class Restaurant {
    id: uuid,
    name: String,
    address: String,
    phoneNumber: String,
    email: String,
    username: String,
    password: String
  }

  class ItemModel {
    id: uiid,
    name: String,
    price: Float,
    tag: Tag,
    desc: String,
    img: String,
    restaurantId: uuid
  }
```