# Structures

## MQTT Message

```js
  const topic = `client/${token}` || `restaurant/${token}`;
```

```js
  const message_opcode = {
    opcode: 'customerArrived', 'newOrder' || 'modifyOrder',
    args: {

    }
  };

  const message_result = {
    opcode: 'customerArrived', 'newOrder' || 'modifyOrder',
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