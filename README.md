# Social Media API Documentation
This is a smple Social Media API documentation. Enjoy!

## Features
- Authentication & authorization using JWT
- CRUD operations
- Comment and reply to the post
- Follow and unfollow other users
- Like and dislike a post
- User can block and unblock other users
- Admin can block and unblock a user
- Auto block user if inactive for more than 180 days
- Last date a post was created by a user
- User award based on number of posts
- Get all users who views someone's profile
- Profile photo uploaded

## End Point
- [Authentication](#Authentication-Endpoint)
  - [Register](#1.-Register)
  - [Login](#2.-Login)
- [User](#User-Endpoint)
  - [Get user profile](https://www.github.com/octokatherine)
  - [Following user](https://www.github.com/octokatherine)
  - [Unfollowing user](https://www.github.com/octokatherine)
  - [Update my profile](https://www.github.com/octokatherine)
  - [Update my user password](https://www.github.com/octokatherine)
  - [Upload profile photo](https://www.github.com/octokatherine)
  - [Block other user](https://www.github.com/octokatherine)
  - [Unblock other user](https://www.github.com/octokatherine)
- [Admin](https://www.github.com/octokatherine)
  - [Get all users](https://www.github.com/octokatherine)
  - [Admin block user](https://www.github.com/octokatherine)
  - [Admin unblock user](https://www.github.com/octokatherine)
  - [Admin delete user](https://www.github.com/octokatherine)

## Authentication Endpoint
Some endpoints may require an authentication to access. For example, to create/delete/update a post, you need to register an account, login, and give the access token. 

You have to put the access token in `Authorization header`.

### 1. Register
In order to use social media endpoints, you must register a new account.

```http
POST /api/v1/users/register
```
```javascript
{
  "firstName": "Zainal",
  "lastName": "Abidin",
  "email": "zabidin384@gmail.com",
  "password": "pass123"
}
```

Parameter details:
| Parameter | Type | Description | Required |
| :-------- | :--- | :---------- | :------- |
| `authentication` | `string` | Your token | No |
| `firstName` | `string` | Your first name | Yes |
| `lastName` | `string` | Your last name | Yes |
| `email` | `string` | Your email | Yes |
| `password` | `string` | Your password | Yes |

### 2. Login
After login into your account, you will get token that require for authentication.

```http
POST /api/v1/users/login
```
```javascript
{
  "email": "zabidin384@gmail.com",
  "password": "pass123"
}
```

Parameter details:
| Parameter | Type | Description | Required |
| :-------- | :--- | :---------- | :------- |
| `authentication` | `string` | Your token | No |
| `email` | `string` | Your email | Yes |
| `password` | `string` | Your password | Yes |

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-4c68d7?style=for-the-badge&logo=ko-fi&logoColor=white)](https://zainal.netlify.app/)
[![instagram](https://img.shields.io/badge/instagram-8a3ab9?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/)
[![email](https://img.shields.io/badge/gmail-bb001b?style=for-the-badge&logo=gmail&logoColor=white)](https://gmail.com/)

__Technology:__ Node Js, Express Js, MongoDB, Mongoose, JWT
