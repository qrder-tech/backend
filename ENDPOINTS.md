# Endpoints

This documentation provides detailed information about the endpoints of the backend. To try the requests below use the [Postman](https://qrder-tech.postman.co/workspace/Qrder-Workspace~68cd0616-6f79-4bbd-805b-df109816aaf7/overview) collections. Check this document regularly for the updates.

## Endpoints, Methods and Authentication Types
Method | Endpoint | Auth Type
-- | -- | --
`POST` | [/auth/login](#authlogin) | Unauthenticated
`POST` | [/auth/registration](#authregistration) | Unauthenticated
`POST` | /auth/token/validate | `user`, `restaurant`
`POST` | /auth/token/renew | `user`, `restaurant`
||
`GET`, `POST` | [/user/me](#userme) | `user`
||
`GET` | [/restaurant](#restaurant) | `user`
`GET`, `POST` | [/restaurant/me](#restaurantme) | `restaurant`
`GET` | [/restaurant/menu](#restaurantmenu) | `restaurant`
`GET`, `POST`, `DELETE` | [/restaurant/item](#restaurantitem) | `restaurant`
`GET` | [/restaurant/orders](#restaurantorders) | `restaurant`
||
`GET` | [/order](#order) | `user`, `restaurant`
`POST` | [/order/new](#ordernew) | `user`, `restaurant`
`POST` | [/order/modify](#ordermodify) | `user`, `restaurant`
`POST` | [/order/pay](#orderpay) | `user`, `restaurant`

---

## Error Codes and Reasons
Code | Message | Reason
-- | -- | --
400 | Arguments are missing | Be ensure that query and body params are complete.
400 | Invalid arguments | Be ensure that query and body params are correct.
400 | Duplicated arguments | Be ensure that query and body params are unique.
400 | Arguments cannot pass validator | Be ensure that query and body params are valid.
400 | Unknown error | Something goes wrong. Contact with the developer.
401 | Unauthorized action | Either authentication token is not specified in the request header or you are not authorized for the request.
401 | Invalid token | Your token is not valid.

---

## /auth/login
### `POST`:
##### Query Params:
Name | Type | Information
-- | -- | --
type | String | `user` or `restaurant`
##### Body Params:
Name | Type | Information
-- | -- | --
username | String | 
password | String | 
##### Response:
Name | Type | Information
-- | -- | --
token | String |

## /auth/registration
### `POST`:
##### Query Params:
Name | Type | Information
-- | -- | --
type | String | `user` or `restaurant`
##### Body Params:
Name | Type | Information
-- | -- | --
name | String | 
surname _(Dependent)_ | String | If the request type is `user`, it is required.
address _(Dependent)_ | String | If the request type is `restaurant`, it is required.
phoneNumber _(Dependent)_ | String | If the request type is `restaurant`, it is required.
email | String | 
name | String | 
username | String | 
password | String | 
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean |

---

## /user/me
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
||
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
surname | String | 
email | String | 
username | String | 
activeOrder _(Dependent)_ | Order | If user has an unpaid order, it must be returned.
### `POST`:
##### Body Params:
Name | Type | Information
-- | -- | --
name _(Optional)_ | String | 
surname _(Optional)_ | String | 
email _(Optional)_ | String | 
password _(Optional)_ | String |
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean | 

---

## /restaurant
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
uuid | Uuid |
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
address | Float | 
phoneNumber | String | 
email | String | 
menu | Item[] | Array of the Item model associated with the given restaurant uuid.

## /restaurant/me
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
||
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
address | Float | 
phoneNumber | String | 
email | String | 
### `POST`:
##### Body Params:
Name | Type | Information
-- | -- | --
name _(Optional)_ | String | 
address _(Optional)_ | Float | 
phoneNumber _(Optional)_ | String | 
email _(Optional)_ | String | 
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean

## /restaurant/menu
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
||
##### Response:
Name | Type | Information
-- | -- | --
menu | Item[] | Array of Item model

## /restaurant/item
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
name | String | 
price | Float | 
desc | String | 
tag | String | 
img | String | 
metadata | String | Specifications for the item. Separated with semicolon (`;`) 
### `POST`:
##### Query Params:
Name | Type | Information
-- | -- | --
uuid _(Optional)_ | Uuid | If it does not exist, a new item will be created.
##### Body Params:
Name | Type | Information
-- | -- | --
name _(Optional)_ | String | If a new item will be created, it is required.
price _(Optional)_ | Float | If a new item will be created, it is required.
desc _(Optional)_ | String | If a new item will be created, it is required.
tag _(Optional)_ | String | If a new item will be created, it is required.
img _(Optional)_ | String | 
metadata _(Optional)_ | String | 
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean
### `DELETE`:
##### Query Params:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean | 

## /restaurant/orders
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
isActive _(Optional)_ | Boolean | Default value is `true`. If the value set to `false`, all orders will be returned, not just the active ones.
##### Response:
Name | Type | Information
-- | -- | --
orders | Order[] | Array of Order model

---

## /order
### `GET`:
##### Query Params:
Name | Type | Information
-- | -- | --
uuid | Uuid |

##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
items | String | 
isPaid | Boolean | 
user _(Dependent)_ | User | The user who is associated with the order. If the request is made by a restaurant, it will be returned.
restaurant _(Dependent)_ | Restaurant | The restaurant who is associated with the order. If the request is made by a user, it will be returned.

## /order/new
### `POST`:
##### Body Params:
Name | Type | Information
-- | -- | --
userUuid _(Dependent)_ | Uuid | If the request is made by a restaurant, it is required.
restaurantUuid _(Dependent)_ | Uuid | If the request is made by a user, it is required.
tableId | Int |
items | OrderItem[] | (uuid, metadata, quantity). Metadata part of items must be `0` or `1` for each specification and separated with semicolon (`;`)  
##### Response:
Name | Type | Information
-- | -- | --
uuid | Uuid | 

## /order/modify
### `POST`:
##### Body Params:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
items | OrderItem[] | (uuid, metadata, quantity). All items -either modified or not- must be in the array.
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean |

## /order/pay
### `POST`:
##### Body Params:
Name | Type | Information
-- | -- | --
uuid | Uuid | 
token _(Dependent)_ | String | It will be received from an external online payment system. If the request is made by a user, it is required.
isPaid _(Dependent)_ | Boolean | If the order has paid via cash, it must be `true`. If the request is made by a restaurant, it is required.
##### Response:
Name | Type | Information
-- | -- | --
success | Boolean |

---