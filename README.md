# AI-Powered Conference Abstract Submission System

A modern full-stack AI-powered conference abstract submission platform built using React, Spring Boot, PostgreSQL, and Google Gemini AI.

The system allows researchers to upload conference abstracts in PDF/DOCX format and automatically receive AI-generated conference session recommendations.

---

# 🚀 Features

## 📄 Abstract Submission

* Upload conference abstracts (PDF/DOCX)
* Author and co-author information
* Participation type selection
* AI-powered session recommendation
* Manual session override support

## 🤖 AI-Powered Session Recommendation

* Extracts text from uploaded abstracts
* Uses Google Gemini AI for intelligent classification
* Automatically suggests the most suitable conference session

## 🧠 Supported Conference Sessions

* Artificial Intelligence
* Machine Learning
* Data Science
* Cybersecurity
* Cloud Computing
* IoT
* Blockchain
* Robotics
* Healthcare Technology
* Life Sciences
* Sustainable Engineering

## 📊 Admin Dashboard

* View all submissions
* Filter by session
* Download uploaded files
* View AI suggested session
* Responsive dashboard UI

## 🔒 Validation & Error Handling

* File type validation
* File size validation (Max 5MB)
* Form validation
* API exception handling
* AI fallback handling

---

# 🛠️ Tech Stack

## Frontend

* React
* React Router
* Axios
* Bootstrap 5
* Custom CSS

## Backend

* Spring Boot
* Spring Data JPA
* PostgreSQL
* Lombok
* Validation API

## AI Integration

* Google Gemini API

## Document Processing

* Apache PDFBox
* Apache POI

---

# 🏗️ System Architecture

```text
User Uploads Abstract
        ↓
React Frontend
        ↓
Spring Boot REST API
        ↓
PDF/DOCX Text Extraction
        ↓
Google Gemini AI Analysis
        ↓
AI Session Recommendation
        ↓
PostgreSQL Database Storage
        ↓
Admin Dashboard Display
```

---

# 📁 Project Structure

## Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── App.js
```

## Backend

```text
backend/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── config/
└── AiConferenceApplication.java
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
```

---

# 🖥️ Backend Setup

## Navigate to backend folder

```bash
cd backend
```

## Configure PostgreSQL Database

Update:

```properties
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_conference
spring.datasource.username=postgres
spring.datasource.password=your_password

google.ai.api.key=YOUR_GEMINI_API_KEY
google.ai.model=gemini-2.5-flash
```

## Run Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

# 🌐 Frontend Setup

## Navigate to frontend folder

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔌 API Endpoints

| Method | Endpoint                         | Description                |
| ------ | -------------------------------- | -------------------------- |
| POST   | `/api/submissions/analyze`       | Analyze abstract using AI  |
| POST   | `/api/submissions`               | Submit conference abstract |
| GET    | `/api/admin/submissions`         | Get all submissions        |
| GET    | `/api/admin/submissions/{id}`    | Get submission by ID       |
| GET    | `/api/submissions/{id}/download` | Download uploaded file     |

---

# 📤 Supported File Types

* PDF
* DOCX

Maximum file size:

```text
5MB
```

---

# 🧪 Sample Workflow

1. User uploads abstract
2. System extracts abstract text
3. Gemini AI analyzes content
4. AI suggests conference session
5. User reviews/edits suggestion
6. Submission saved to PostgreSQL
7. Admin views submissions in dashboard

---

# 📸 Screenshots

## Home Page

(Add screenshot here)

## Submission Form

(Add screenshot here)

## Admin Dashboard

(Add screenshot here)

---

# 🔮 Future Enhancements

* Authentication & authorization
* Email notifications
* Reviewer management system
* Conference scheduling module
* Analytics dashboard
* AI confidence scoring
* Multi-language support

---

# 👨‍💻 Developed For

Final Year Academic Project

---

# 📜 License

This project is developed for educational and academic purposes.
