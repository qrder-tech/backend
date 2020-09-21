#  Routes

## Route: ``/user/*``
### /user/login
`POST`:
```js
{
  request: {
    "username": string
    "password": string
  }
}
```

```js
{
  response: {
    "token": string
  }
}
```

### /user/register
`POST`:
```js
{
  request: {
    "name": string
    "surname": string
    "email": string
    "username": string
    "password": string
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
    "name": string
    "surname": string
    "email": string
    "username": string
    "password": string
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
    "items": List <Item>
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
    ...
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