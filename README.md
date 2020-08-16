# backend

### /user/*
* POST /user/login
{
  "username": string
  "password": string
} request

{
  "token": string
} response

* POST /user/signin
{
  "name": string
  "surname": string
  "email": string
  "username": string
  "password": string
} request

```
* * POST /user/verify
{
  "verification code": string
} request
```

* POST /user/me
{
  "name": ?
  "surname": ?
  "email": ?
  "username": ?
  "password": ?
}

* GET /user/me
{
  "name": string
  "surname": string
  "email": string
  "username": string
  "password": string
} response

* GET /user/logout


### /order/*

* POST /order/new
{
  "restaurant_id": Int
  "table_id": Int
  "items": List<Item>
} request

{
  "order_id": Int
} response

* GET /order/{order_id}
{
  "items": List<Item>
} response

* POST /order/modify
ModifiedItem {
  "modification": Int (0 = add, 1 = delete, 2 = change)
  "item_id": Int
  "data": Item
}

{
  "order_id": Int
  "items": List<ModifiedItem>
} request

ModificationResponse {
  "item_id": Int
  "status": Int (0 = success, 1 = failed)
}

{
  "items" List<ModificationResponse>
} response

* DELETE /order/remove/{order_id}

### /restaurant/*

* GET /restaturant/{restaurant_id}
{

} response

* GET /restaurant/orders
Order {
  "order_id": Int
  "table_id": Int
}

{
  orders: List<Order>
} response

* GET /restaurant/me
{

} response

* POST /restaurant/me
{

} response

* POST /restaurant/menu
{
  "restaurant_id": ?
} request

MenuModel {
  
} response

* POST /restaurant/menu/modify
ModifiedItem: {
  "opcode": (0 = add, 1 = remove)
  "item_id": Int
}

{
  "modification": List<ModifiedItem>
} request

* POST /restaurant/item/modify
{
  "opcode" = (0 = add, 1 = remove, 2 = modify)
  "item_id": Int ?
  "data": Item ?
} request
