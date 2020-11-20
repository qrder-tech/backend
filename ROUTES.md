#  Routes

## Route: ``/user/*``
### /user/login
`POST`:
```js
{
  request: {
    "username": String
    "password": String
  }
}
```

```js
{
  response: {
    "token": String
  }
}
```

### /user/register
`POST`:
```js
{
  request: {
    "name": String
    "surname": String
    "email": String
    "username": String
    "password": String
  }
}
```

#### /user/me
`POST`:
```js
{
  request: {
    "name": ?
    "surname": ?
    "email": ?
    "username": ?
    "password": ?
  }
}
```

`GET`:
```js
{
  response: {
    "name": String
    "surname": String
    "email": String
    "username": String
    "password": String
  }
}
```

### /user/logout
`GET`:
```js
>>> TODO
```


## Route: ``/order/*``

### /order/new
`POST`:
```js
{
  request: {
    "restaurant_id": Int
    "table_id": Int
    "items": [
      {
        uuid: String,
        metadata: String, // "0;1;1"
        quantity: Int
      },
      ...
    ]
  }
}
```

```js
{
  response: {
    "order_id": Int
  }
}
```

### /order/{order_id}
`GET`:
```js
{
  response: {
    "items": List <Item>
  }
}
```

### /order/modify
`POST`:
```js
{
  request: {
    "order_id": Int
    "items": List <ModifiedItem>
  }
}
```

```js
{
  response: {
    "items" List <ModificationResponse>
  }
}
```

```js
class ModifiedItem {
  "modification": Int // (0 = add, 1 = delete, 2 = change)
  "item_id": Int
  "data": Item
}
```

```js
class ModificationResponse {
  "item_id": Int
  "status": Int // (0 = success, 1 = failed)
}
```

### /order/remove/{order_id}
`DELETE`:
```js
>>> TODO
```

## Route: ``/restaurant/*``

### /restaturant/{restaurant_id}
`GET`:
```js
{
  response: {
    ...
  }
}
```

### /restaurant/orders
`GET`:
```js
{
  response: {
    "orders": List <Order>
  }
}
```

```js
class Order {
  "order_id": Int
  "table_id": Int
}
```

### /restaurant/me
`POST`:
```js
{
  request: {
    ...
  }
}
```

### /restaurant/me
`GET`:
```js
{
  response: {
    ...
  }
}
```

### /restaurant/menu
`GET`:
```js
{
  request: {
    "restaurant_id": Int
  }
}
```
```js
{
  response: {
    "menu" : List<Item>
  }
}
```

### /restaurant/menu/modify
`POST`:
```js
{
  request: {
    "modification": List <ModifiedItem>
  }
}
```

```js
class ModifiedItem: {
  "opcode": // (0 = add, 1 = remove)
  "item_id": Int
}
```

### /restaurant/item/modify
`POST`:
```js
{
  request: {
    "opcode": Int // (0 = add, 1 = remove, 2 = modify)
    "item_id": Int?
    "data": Item?
  }
}
```
