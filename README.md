# ChargeHub 

## 🔗 Live Demo

👉 [https://Charge-Hub-Live.com](https://charge-hub-delta.vercel.app/listings)


<img width="1440" height="900" alt="Screenshot 2026-01-08 at 5 30 49 PM" src="https://github.com/user-attachments/assets/75b56e7c-7d42-4510-b2ce-13007ce5a974" />


**ChargeHub** is a full-stack marketplace application designed to simplify access to EV charging infrastructure.
It enables users to create and discover charging station listings, visualise locations on interactive maps, and rent chargers based on availability and pricing.

---

## 🚧 Project Status

🟡 **In Progress**  
Core features are implemented and working. Additional improvements and optimisations are planned.

---

## ✨ Features

- **Smart Search** – Search EV charging stations based on **car company** and **location**.
- **Map-Based Discovery** – Integrated **Mapbox** to display charging stations with precise geolocation.
- **User Reviews & Ratings** – Users can add reviews to share charging experiences and feedback.
- **Authentication & Authorization** – Secure session-based authentication using **Passport.js**.
- **MVC Architecture** – Backend structured with the **Model–View–Controller** pattern for scalability and maintainability.
- **Efficient Data Management** – Well-designed schemas for listings, pricing, geolocation, and reviews.

---

## 🚀 Future Enhancements

-  Time-slot based booking for charging stations
-  Payment integration for seamless rentals
-  Notification system for booking updates
-  Advanced filtering and sorting options
-  Improved mobile-first UI experience
---

## 🛠️ Tech Stack

**Frontend**
- EJS
- HTML5, CSS3
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- Passport.js (Authentication)

**Database**
- MongoDB

**APIs & Tools**
- Mapbox API (Geolocation & Maps)
- Git & GitHub
---

## 🧠 What I Learned

- Designing scalable backend systems using MVC architecture
- Implementing secure authentication with Passport.js
- Working with geolocation data and map-based visualisations
- Structuring full-stack applications with clean separation of concerns
- Deploying and managing production-ready web applications

## 🤝 How to Contribute

Contributions are welcome! If you’d like to improve **ChargeHub**, you can follow the steps below 🚀

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/ChargeHub.git
cd ChargeHub

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add required environment variables in .env
# MONGO_URI=your_mongodb_uri
# MAPBOX_TOKEN=your_mapbox_token
# SESSION_SECRET=your_secret

# Run the project locally
npm start

# Create a new branch for your changes
git checkout -b feature/your-feature-name

# Commit and push your changes
git add .
git commit -m "Describe your change"
git push origin feature/your-feature-name
