# 🌾 AstegonTech Solutions (Nandan Foods) - E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/License-ISC-blue) ![Status](https://img.shields.io/badge/Status-Active_Development-orange)

A comprehensive, full-stack e-commerce solution catering to agricultural products. The platform connects customers with quality food products through a seamless shopping experience and empowers sellers with a robust dashboard for real-time order management.

## 📚 Table of Contents
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting](#-troubleshooting)

---

## 🏗 Architecture
The application follows a **Client-Server Architecture**:
-   **Frontend (Client)**: Built with React (Vite) and TailwindCSS, hosted usually on Vercel. It communicates with the backend via RESTful APIs.
-   **Backend (Server)**: Node.js/Express application, hosted usually on Render/Vercel. It handles business logic, database operations (MongoDB), and third-party integrations (Stripe, Cloudinary, Firebase).

![Architecture Diagram](https://mermaid.ink/img/pako:eNpFkM1qwzAQhF9F7LkG8gE8FAKlhRZSAt1DL4q1tYmsK0tWyW5C8N1ryQ9y6mFmP80M2l1jJAnstXp18GzwOSQDJz9K_mC8_Hh5nB7eXh_n2fF0ePo8z07T9PhxmZ2n2en943Q8Pc_O0_z4eX76-HiaH-8fPz7Pj_eP0_z4ePo6P97_z7PT-8_p7Xl2-vg8O0_T_evs9P51_jydpvvX6el1fvz4ODtP0_3r9PR6fvy4f5ydpvvX6en1_Pj--XF2_zhN96_T0_vX-el5dnr_ODtN0_3r9PR6fvx4_zg7Tfev09Pr-fHjq0cZ0QIvGq0tWq-D1kCD8WAcWOfR?type=png)

---

## 🌟 Key Features

### 🛒 Customer Storefront
-   **Dynamic Catalog**: Products are fetched in real-time with support for categories, search, and weight variants.
-   **Smart Cart**: Optimistic UI updates for adding/removing items. Persists selection across sessions.
-   **Secure Checkout**: Integrated Stripe Payment Gateway and Cash on Delivery (COD) options.
-   **User Accounts**: Secure login/signup via Email & OTP (Firebase Auth).
-   **Address Book**: Store multiple delivery addresses.
-   **Order Tracking**: View order history and live status updates.

### 👨‍💼 Seller Dashboard
-   **Real-Time Command Center**:
    -   **Audio Notifications**: "New Order" sound plays instantly when an order arrives (requires one-click authorization).
    -   **Visual Indicators**: Red "New" badge on fresh orders.
    -   **Auto-Polling**: The systems checks key metrics every 5 seconds.
-   **Product Studio**:
    -   Create listings with rich text descriptions.
    -   **Drag-and-Drop Image Upload**: Integrated with Cloudinary for optimized image hosting.
    -   Stock management.
-   **Order Workflow**: Move orders through stages: `Order Placed` -> `Packing` -> `Shipped` -> `Delivered`.

---

## 💻 Tech Stack

| Type | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | FAST High-performance UI library |
| | TailwindCSS 4 | Utility-first styling |
| | React Router DOM v7 | Application routing |
| | Axios | API Requests |
| | React Hot Toast | Beautiful Notifications |
| **Backend** | Node.js / Express | Server Runtime & API |
| | MongoDB / Mongoose | NoSQL Database & ORM |
| | JSON Web Tokens | Stateless Authentication |
| | Nodemailer | Email Services (OTP/Notifications) |
| **Services** | Firebase Auth | Phone/Email OTP Verification |
| | Cloudinary | Image Storage & Optimization |
| | Stripe | Payment Processing |

---

## 📋 Prerequisites
Before running the project, ensure you have:
-   **Node.js**: v18.17.0 or higher.
-   **MongoDB Atlas**: A cloud database cluster.
-   **Cloudinary Account**: For image hosting credentials.
-   **Stripe Account**: For payment API keys.
-   **Firebase Project**: For authentication config.

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/Nandan-Foods-main.git
cd Nandan-Foods-main
```

### 2. Backend Setup
```bash
cd server
npm install
```
*Create a `.env` file in the `/server` folder (see [Environment Variables](#-environment-variables) below).*

Run the server:
```bash
npm run dev
# Server will start on http://localhost:4000
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd client
npm install
```
*Create a `.env` file in the `/client` folder (see [Environment Variables](#-environment-variables) below).*

Run the client:
```bash
npm run dev
# Client will start on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`/server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server Port | `4000` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing tokens | `supersecretkey` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `dyn...` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `382...` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `sk_...` |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | `sk_test_...` |
| `SMTP_USER` | Email for sending OTPs | `alerts@gmail.com` |
| `SMTP_PASS` | App Password for Email | `abcd...` |
| `FRONTEND_URL` | Client URL (for CORS) | `http://localhost:5173` |

### Frontend (`/client/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | API Base URL | `http://localhost:4000` |
| `VITE_CURRENCY` | Currency Symbol | `₹` |
| `VITE_FIREBASE_API_KEY` | Firebase Config | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Config | `app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Config | `my-app` |

---

## 📡 API Documentation

### Auth & User (`/api/user`)
-   `POST /register`: Register a new user.
-   `POST /login`: Login with Email/Password.
-   `POST /verify-email`: Verify OTP for registration.
-   `POST /forgot-password`: Request password reset OTP.
-   `POST /reset-password`: Reset password with OTP.

### Products (`/api/product`)
-   `GET /list`: Get all products.
-   `GET /id`: Get single product by ID.
-   `POST /add`: Create product (Seller only).
-   `POST /update`: Edit product (Seller only).
-   `POST /delete`: Delete product (Seller only).

### Orders (`/api/order`)
-   `POST /cod`: Place Cash on Delivery order.
-   `POST /stripe`: Init Stripe checkout session.
-   `GET /user`: Get my orders (Customer).
-   `GET /seller`: Get all orders (Seller).
-   `POST /status`: Update order status (Seller).

---

## ☁️ Deployment Guide

### Client (Vercel)
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Set Root Directory to `client`.
4.  Add Frontend Environment Variables in Vercel Settings.
5.  Deploy.

### Server (Render/Vercel)
**Option A: Render (Recommended for Websockets/Polling)**
1.  Connect GitHub repo.
2.  Set Root Directory to `server`.
3.  Build Command: `npm install`
4.  Start Command: `node server.js`
5.  Add Backend Environment Variables.

---

## ❓ Troubleshooting

**Q: "Network Error" in Seller Dashboard?**
A: This usually happens if the backend spins down due to inactivity (common on free tiers). Just wait 30 seconds for it to wake up.

**Q: Sound notifications not playing?**
A: Browsers block autoplay. Click anywhere on the dashboard page once to "unlock" the audio permission invisibly.

**Q: Images not uploading?**
A: Check your Cloudinary credentials in `.env` and ensure your internet connection allows uploading large files.
