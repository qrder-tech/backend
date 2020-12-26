# Endpoints

This documentation provides detailed information about the endpoints of the backend. To try the requests below use the [Postman](https://qrder-tech.postman.co/workspace/Qrder-Workspace~68cd0616-6f79-4bbd-805b-df109816aaf7/overview) collections. Check this document regularly for the updates.

## Endpoints, Methods and Authentication Types
Method | Endpoint | Auth Type
-- | -- | --
`POST` | [/auth/login](#authlogin) | Unauthenticated
`POST` | [/auth/registration](#authregistration) | Unauthenticated
`POST` | /auth/activate | Unauthenticated
`POST` | /auth/token/validate | `consumer`, `restaurant`
`POST` | /auth/token/renew | `consumer`, `restaurant`
||
`GET`, `POST` | [/consumer/me](#consumerme) | `consumer`
`GET` | [/consumer/offers](#consumeroffers) | `consumer`
`GET`, `POST` | [/consumer/favourites]() | `consumer`
`GET`, `POST` | [/consumer/wallet]() | `consumer`
||
`GET` | [/restaurant](#restaurant) | `consumer`
`GET`, `POST` | [/restaurant/me](#restaurantme) | `restaurant`
`GET` | [/restaurant/menu](#restaurantmenu) | `restaurant`
`GET`, `POST`, `DELETE` | [/restaurant/item](#restaurantitem) | `restaurant`
`GET`, `POST` | [/restaurant/tables](#restauranttables) | `restaurant`
`GET` | [/restaurant/services](#restaurantservices) | `restaurant`
||
`GET`, `POST`, `DELETE` | [/order](#order) | `consumer`, `restaurant`
`GET` | [/order/all](#orderall) | `consumer`, `restaurant`
`POST` | [/order/pay](#orderpay) | `consumer`, `restaurant`

---

## Error Codes and Reasons
Code | Message | Reason
-- | -- | --
400 | Arguments are missing | Be ensure that query and body params are complete.
400 | Invalid arguments | Be ensure that query and body params are correct.
400 | Duplicated arguments | Be ensure that query and body params are unique.
400 | Arguments cannot pass validator | Be ensure that query and body params are valid.
500 | Unknown error | Something goes wrong. Contact with the developer.
401 | Unauthorized action | Either authentication token is not specified in the request header or you are not authorized for the request.
401 | Invalid token | Your token is not valid.

---

## /auth/login
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
type | _(Required)_ | String | `consumer` or `restaurant`
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
username | _(Required)_ | String | 
password | _(Required)_ | String | 
##### Response:
Name | Type | Information
-- | -- | --
token | String |

## /auth/registration
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
type | _(Required)_ | String | `consumer` or `restaurant`
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
name | _(Required)_ | String | 
surname | _(Dependent)_ | String | If the request type is `consumer`, it is required.
address | _(Dependent)_ | String | If the request type is `restaurant`, it is required.
phoneNumber | _(Required)_ | String | 
email | _(Required)_ | String | 
serviceType | _(Dependent)_ | String | If the request type is `restaurant`, it is required. It should be either `normal` or `self`.
username | _(Required)_ | String | 
password | _(Required)_ | String | 
##### Response:
Name| Type | Information
-- | -- | --
||

---

## /consumer/me
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
surname | String | 
phoneNumber | String | 
email | String | 
img | String | Url of the `consumer` avatar.
username | String | 
activeOrder | Order | If `user` has an unpaid order, it will be returned.
### `POST`:
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
name | _(Optional)_ | String | 
surname | _(Optional)_ | String | 
phoneNumber | _(Optional)_ | String | 
email | _(Optional)_ | String | 
img | _(Optional)_ | base64 | `consumer` avatar in the base64 format.
username | _(Optional)_ | String | 
password | _(Optional)_ | String |
##### Response:
Name | Type | Information
-- | -- | --
||

## /consumer/offers
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
banners | String[] | Array of the banner image Urls.

## /consumer/favourites
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
favourites | Restaurant[] | Array of the Restaurant model associated with the `consumer`.
### `POST`:
##### Body Params:
Name | | Type | Information
-- | -- | -- | --

##### Response:
Name | Type | Information
-- | -- | --
||

---

## /restaurant
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Optional)_ | Uuid | Uuid of the `restaurant`.
lat | _(Optional)_ | Uuid | Latitude of the `consumer`.
lng | _(Optional)_ | Uuid | Longitude of the `consumer`.
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
address | String | 
phoneNumber | String | 
email | String | 
img | String | Url of the `restaurant` logo
serviceType | String | 
menu | Item[] | Array of the Item model associated with the given `restaurant` uuid.

## /restaurant/me
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
address | String | 
phoneNumber | String | 
email | String | 
img | String | Url of the `restaurant` logo.
serviceType | String | 
username | String | 
### `POST`:
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
name | _(Optional)_ | String | 
address | _(Optional)_ | Float | 
phoneNumber | _(Optional)_ | String | 
email | _(Optional)_ | String | 
img | _(Optional)_ | base64 | `restaurant` logo in the base64 format.
serviceType | _(Optional)_ | String | 
username | _(Optional)_ | String | 
password | _(Optional)_ | String | 
##### Response:
Name | Type | Information
-- | -- | --
||

## /restaurant/menu
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
menu | Item[] | Array of the Item model associated with the `restaurant`.

## /restaurant/item
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Required)_ | Uuid | Uuid of the item.
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
price | Float | 
desc | String | 
type | String | 
img | String | Url of the item image.
options | String[] | Specifications for the item.
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Optional)_ | Uuid | Uuid of the item. If it does not exist, a new item will be created.
##### Body Params:
Name | Type | Information
-- | -- | --
name _(Optional)_ | String | If a new item will be created, it is required.
price _(Optional)_ | Float | If a new item will be created, it is required.
desc _(Optional)_ | String | If a new item will be created, it is required.
type _(Optional)_ | String | If a new item will be created, it is required.
img _(Optional)_ | base64 | Item image in the base64 format.
options _(Optional)_ | String[] | Specifications for the item.
##### Response:
Name | Type | Information
-- | -- | --
||
### `DELETE`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Required)_ | Uuid | Uuid of the item.
##### Response:
Name | Type | Information
-- | -- | --
|| 

## /restaurant/tables
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
|||
##### Response:
Name | Type | Information
-- | -- | --
tables | Table[] | Array of the Table model associated with the `restaurant`.
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Optional)_ | Uuid | Uuid of the table. If it does not exist, a new table will be created.
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
name | _(Optional)_ | String | If a new table will be created, it is required.
status | _(Optional)_ | String | It can be `null` or `occipied`.
services | _(Optional)_ | Service[] | Service is an object of `{ name: String, createdAt: Date }`.
##### Response:
Name | Type | Information
-- | -- | --
||

---

## /order
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Required)_ | Uuid | Uuid of the order.
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
no | int | Daily order number.
items | Item[] | Array of the Item model associated with the order.
status | String | It can be `waiting`, `served` or `paid`.
totalPrice | Float | 
consumer _(Dependent)_ | Consumer | The consumer who is associated with the order. If the request is made by a `restaurant`, it will be returned.
restaurant _(Dependent)_ | Restaurant | The restaurant who is associated with the order. If the request is made by a `consumer`, it will be returned.
restaurant _(Dependent)_ | Table | The table who is associated with the order.
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Optional)_ | Uuid | Uuid of the order. If it does not exist, a new order will be created.
##### Body Params:
Name | | Type | Information
-- | -- | -- | --
restaurantUuid | _(Dependent)_ | Uuid | If the request is made by a `consumer`, it is required.
tableUuid | _(Dependent)_ | Uuid | If the serviceType of the related `restaurant` is `normal`, it is required.
status | _(Optional)_ | String | It can be `waiting`, `served` or `paid`.
items | _(Dependent)_ | OrderItem[] | OrderItem is an object of `{ uuid: Uuid, options: String[], quantity: Int }`. If a new order will be created, it is required. If the existing order has already the same OrderItem with `uuid` and `options` group than, quantity of corresponding OrderItem will be added by given quantity.
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | Uuid of the new / updated order.
### `DELETE`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Required)_ | Uuid | Uuid of the order. Status of the corresponding order should be `waiting`.
##### Response:
Name | Type | Information
-- | -- | --
|| 

## /order/all
### `GET`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
scope | _(Optional)_ | String | Default value is `all`. According to scope, corresponding orders will be returned. It can be `all`, `waiting`, `served` or `paid`.
start | _(Optional)_ | int | Default value is `0`. It is the index of the first item that will be returned.
length | _(Optional)_ | int | Default value is `10`. It is the length of the array that will be returned.
##### Response:
Name | Type | Information
-- | -- | --
orders | Order[] | Array of the Order model associated with the `consumer` or `restaurant`.

## /order/pay
### `POST`:
##### Query Params:
Name | | Type | Information
-- | -- | -- | --
uuid | _(Required)_ | Uuid | Uuid of the order.
##### Body Params:
Name | Type | Information
-- | -- | --
token _(Dependent)_ | String | It will be received from an external online payment system. If the request is made by a `consumer`, it is optional. If it not exists, `consumer` balance will be used.
##### Response:
Name | Type | Information
-- | -- | --
||
