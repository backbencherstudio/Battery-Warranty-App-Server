# Authentication & User Management API Documentation

## Overview
This document provides an overview of the API endpoints for user authentication, management, and related functionalities. Use the provided endpoints for tasks such as user registration, login, password recovery, and profile management.

## Base URL
```
http://192.168.40.47:3000
```

---

## Authentication & User Management Routes

### 1. Send OTP for Signup
**Endpoint:**
```
POST /users/signup/send-otp
```
**Request Body:**
```json
{
  "email": "string",
  "name": "string"
}
```

---

### 2. Verify OTP for Signup
**Endpoint:**
```
POST /users/signup/verify-otp
```
**Request Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

---

### 3. Register User
**Endpoint:**
```
POST /users/signup/register
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

### 4. Login User
**Endpoint:**
```
POST /users/login
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

### 5. Google Authentication
**Endpoint:**
```
POST /users/auth/google
```
**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "photoUrl": "string",
  "googleId": "string"
}
```

---

## Password Recovery Routes

### 6. Send OTP for Password Recovery
**Endpoint:**
```
POST /users/forgot-password/send-otp
```
**Request Body:**
```json
{
  "email": "string"
}
```

---

### 7. Verify OTP for Password Recovery
**Endpoint:**
```
POST /users/forgot-password/verify-otp
```
**Request Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

---

### 8. Reset Password
**Endpoint:**
```
POST /users/forgot-password/reset
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

## User Profile Routes

### 9. Verify User (First-time Access)
**Endpoint:**
```
GET /users/verify
```
**Headers:**
```
Authorization: token
```

---

### 10. Get Single User
**Endpoint:**
```
GET /users/get-one-users/:id
```
**Params:**
```
id: string
```

---

### 11. Get All Users
**Endpoint:**
```
GET /users/get-all-users
```

---

### 12. Edit User Profile
**Endpoint:**
```
PATCH /users/edit-profile
```
**Headers:**
```
Authorization: token
```
**Request Body (FormData):**
- **name:** string
- **address:** string
- **image:** File

---

## Static Files (Optional)

### 13. Access Uploaded Images
**Endpoint:**
```
GET /uploads/{filename}
```
**Description:**
Access uploaded images by providing the filename.

---

## Postman Collection 
Access the Postman collection for testing the API:
[Postman Collection Link](https://www.postman.com/web444-4006/workspace/travel/collection/39922573-3c102085-9293-466d-b253-3d8c7e53db87?action=share&creator=39922573&active-environment=39922573-4f2a7f24-9613-420b-b3e6-c51399b90edf)

---

## Notes
- Ensure the `Authorization` token is included in the headers for authenticated routes.
- For profile editing, use `FormData` to send image files along with other data.
- Replace `{filename}` in the static files route with the actual name of the file you wish to access.
  
