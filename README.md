# 🎓 Smart B.Tech Student Management System

### An Intelligent, Centralized and AI-Powered Academic Management Platform

[![Project](https://img.shields.io/badge/Project-University%20Major%20Project-blue)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB)]()
[![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)]()
[![AI](https://img.shields.io/badge/AI-RAG%20%2B%20Ollama-purple)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

<img width="1536" height="1024" alt="image" src="https://github.com/K-Shivakumar07/chaitanya-sms/blob/main/Dashboard%20Image.png?raw=true" />



---

## 📌 Project Overview

The **Smart B.Tech Student Management System** is a centralized and intelligent web-based academic platform designed to simplify the management and accessibility of university academic information.

The system is primarily developed for **B.Tech students** and supports semester-wise academic management across **all eight semesters**.

Instead of searching through multiple platforms, WhatsApp groups, PDFs, notices and faculty messages, students can access their academic information from a **single personalized dashboard**.

The platform combines a traditional Student Management System with an **AI-powered Academic Assistant**, allowing students to interact with their academic information using natural-language questions.

---

## 🎯 Problem Statement

University academic information is often distributed across multiple sources such as:

* WhatsApp groups
* Notice boards
* Faculty messages
* PDF documents
* Different portals and websites
* Classroom communication
* Manually shared academic resources

This makes it difficult for students to quickly find the information they need and increases the possibility of **missed assignments, deadlines and important announcements**.

### Our Solution

The proposed system brings academic information into **one centralized platform** and provides an AI assistant that can understand both structured and unstructured academic information.

---

## 💡 Key Idea

> **Traditional Student Management System → Information Display**

> **Smart Student Management System → Information + Personalization + Search + AI Assistance**

The system transforms a conventional academic information platform into an **intelligent academic assistance system**.

---

## ✨ Key Features

### 👨‍🎓 Student Management

* Student profile
* Branch and semester information
* Section-based academic information
* Personalized dashboard
* Semester selection
* Support for all 8 B.Tech semesters

### 📚 Academic Resources

* 📖 Syllabus
* 🗓️ Timetable
* 📑 Study Materials
* 📄 Notes & PDFs
* 📝 Assignments
* 📢 Announcements
* 🔔 Recent Activities
* ⏰ Upcoming Deadlines
* 🔍 Academic Search

### 🤖 AI Academic Assistant

The AI assistant allows students to ask questions using natural language.

Examples:

```text
What classes do I have today?

What are my Monday classes?

Who teaches Operating Systems?

Do I have any pending assignments?

Which assignments are due this week?

What is my next deadline?

Show me the latest announcement.

Show me the Operating Systems syllabus.

What topics are covered in Unit 4?

Show me the latest DBMS notes.
```

The chatbot understands information from both:

**Structured Data**

* Timetable
* Assignments
* Announcements
* Deadlines
* Subjects
* Faculty information

**Unstructured Data**

* Syllabus
* Notes
* PDFs
* Study Materials
* Academic Documents

---

# 🧠 AI + RAG Architecture

The Academic Assistant follows a **hybrid retrieval architecture**.

```text
                         Student
                            │
                            ▼
                    Natural Language Query
                            │
                            ▼
                  Identify Student Context
                Branch • Semester • Section
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          Structured Data        Document Data
             Retrieval             Retrieval
                 │                     │
                 ▼                     ▼
           PostgreSQL              RAG Pipeline
            / Supabase          Embeddings + FAISS
                 │                     │
                 └──────────┬──────────┘
                            ▼
                    Relevant Context
                            │
                            ▼
                       Local LLM
                        Ollama
                            │
                            ▼
                  Intelligent Response
```

### Why Hybrid AI?

Not every question should be answered using document search.

For example:

```text
"What is my class today?"
```

is best answered from structured timetable data.

While:

```text
"What topics are covered in Unit 4?"
```

can be answered using syllabus/document retrieval.

Therefore, the system combines **database queries + RAG retrieval** to provide more accurate and contextual answers.

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────┐
│                   STUDENT                    │
│                 Web Browser                  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 FRONTEND                     │
│          React + TypeScript + Tailwind       │
│                                              │
│ Dashboard • Semester • Resources • Chatbot  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  BACKEND                     │
│                   Supabase                   │
│                                              │
│ Authentication • APIs • Security • Storage  │
└───────────────┬──────────────────┬───────────┘
                │                  │
                ▼                  ▼
       ┌────────────────┐  ┌─────────────────┐
       │   PostgreSQL   │  │ Supabase Storage │
       │                │  │                 │
       │ Students       │  │ Syllabus        │
       │ Subjects       │  │ Notes           │
       │ Timetable      │  │ PDFs            │
       │ Assignments    │  │ Materials       │
       │ Announcements  │  │ Assignments     │
       └────────────────┘  └─────────────────┘
                │
                │
                ▼
┌──────────────────────────────────────────────┐
│                AI / RAG LAYER                │
│                                              │
│ Python + FastAPI                             │
│ LangChain                                    │
│ Hugging Face Embeddings                      │
│ FAISS Vector Search                          │
│ Ollama + Local LLM                           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
               AI Academic Assistant
```

---

# 🗄️ Database Architecture

The system uses a relational database structure designed to support multiple branches, semesters and students.

### Main Entities

```text
Branches
   │
   ▼
Semesters
   │
   ▼
Subjects
   │
   ├────────── Faculty
   │
   ├────────── Timetable
   │
   ├────────── Assignments
   │
   └────────── Academic Resources

Students
   │
   ▼
Student Semester Enrollment
   │
   ▼
Semester-specific Dashboard
```

### Important Tables

| Table                          | Purpose                           |
| ------------------------------ | --------------------------------- |
| `branches`                     | Stores B.Tech branches            |
| `semesters`                    | Stores Semester I–VIII            |
| `students`                     | Student information               |
| `subjects`                     | Subject details                   |
| `faculty`                      | Faculty information               |
| `student_semester_enrollments` | Student semester mapping          |
| `semester_subjects`            | Subjects offered in each semester |
| `timetable`                    | Class schedules                   |
| `assignments`                  | Assignment information            |
| `assignment_submissions`       | Student submissions               |
| `announcements`                | Academic announcements            |
| `study_materials`              | Study resources                   |
| `notes`                        | Notes and PDFs                    |
| `syllabus`                     | Syllabus information              |
| `recent_activity`              | Student activity                  |
| `academic_events`              | Deadlines and academic events     |
| `chat_sessions`                | AI conversation sessions          |
| `chat_messages`                | Chat history                      |

---

# 🛠️ Technology Stack

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* HTML5
* CSS3

## Backend & Database

* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage
* REST APIs

## AI / RAG

* Python
* FastAPI
* LangChain
* Hugging Face Embeddings
* FAISS
* Ollama
* Local LLM

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

---

# 🔄 Complete User Workflow

```text
Login
  │
  ▼
Student Profile
  │
  ▼
Select Branch / Semester
  │
  ▼
Personalized Dashboard
  │
  ├── Syllabus
  ├── Timetable
  ├── Study Materials
  ├── Notes & PDFs
  ├── Assignments
  ├── Announcements
  ├── Recent Activity
  └── Upcoming Deadlines
           │
           ▼
      AI Assistant
           │
           ▼
   Ask Academic Question
           │
           ▼
 Retrieve Relevant Information
           │
           ▼
    Generate AI Response
```

---

# 📂 Suggested Project Structure

```text
smart-btech-student-management/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── rag/
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
│
├── docs/
│   ├── architecture/
│   ├── screenshots/
│   └── project-report/
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/smart-btech-student-management.git

cd smart-btech-student-management
```

---

## 2. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

The frontend will start on the local development server.

---

## 3. Backend Setup

Create a Python virtual environment:

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

---

# 🔐 Environment Variables

Create a `.env` file for environment-specific configuration.

Example:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

DATABASE_URL=your_database_connection_string

OLLAMA_MODEL=llama3
```

> ⚠️ Never commit passwords, private keys, service-role keys or other sensitive credentials to GitHub.

Use `.env.example` to show the required variable names without exposing actual credentials.

---

# 🤖 Local AI Setup

The project can use **Ollama** to run the language model locally.

Example:

```bash
ollama pull llama3
```

Start Ollama if required:

```bash
ollama serve
```

The AI layer can then communicate with the local model through the application backend.

This approach can reduce dependency on paid cloud AI APIs.

---

# 📚 RAG Pipeline

The document-based knowledge pipeline follows these steps:

```text
Academic PDF / Document
          │
          ▼
     Text Extraction
          │
          ▼
       Chunking
          │
          ▼
      Embeddings
          │
          ▼
   FAISS Vector Store
          │
          ▼
   Similarity Search
          │
          ▼
 Relevant Document Context
          │
          ▼
       Local LLM
          │
          ▼
    Final AI Response
```

---

# 🔒 Security

The system is designed with security and access control in mind.

Key security practices include:

* Supabase Authentication
* Role-based access
* Row Level Security (RLS)
* Semester-specific data access
* Secure API communication
* Protected environment variables
* No plaintext password storage
* Restricted student-specific information

---

# 📊 Benefits & Impact

### For Students

* Centralized academic information
* Faster access to resources
* Personalized semester dashboard
* Better deadline management
* Reduced information searching
* Natural-language academic assistance

### For Faculty

* Centralized resource distribution
* Easier communication of announcements
* Organized academic content
* Reduced dependency on multiple communication channels

### For the University

* Digital academic ecosystem
* Better information organization
* Scalable architecture
* Improved student accessibility
* Foundation for future AI-powered academic services

---

# 🚀 Future Scope

The platform can be extended with:

* 📊 Attendance Management
* 📝 Marks Management
* 🎓 SGPA / CGPA Calculation
* 📅 Examination Management
* 🔔 Smart Notifications
* 🧠 AI Study Planner
* 📈 Academic Performance Analytics
* 👨‍🏫 Faculty Portal
* 👨‍💼 HOD Portal
* 🛠️ Admin Portal
* 💼 Placement Management
* 💰 Fee Management
* 📜 Certificate Management
* 🤖 University-wide AI Assistant

---

# 🌟 What Makes This Project Different?

The major innovation is the **context-aware AI Academic Assistant**.

Instead of creating a chatbot that only searches PDFs, the system combines:

```text
        ┌──────────────────────┐
        │   Structured Data    │
        │   PostgreSQL         │
        └──────────┬───────────┘
                   │
                   ├──────────────┐
                   │              │
                   ▼              ▼
              Database          RAG
              Queries          Search
                   │              │
                   └──────┬───────┘
                          ▼
                    AI Assistant
                          │
                          ▼
                 Contextual Answer
```

This enables students to ask questions about their **complete academic dashboard**, rather than only uploaded documents.

---

# 🎯 Project Objectives

1. Centralize B.Tech academic information.
2. Support all eight semesters.
3. Provide personalized semester-wise dashboards.
4. Reduce academic information fragmentation.
5. Improve accessibility of academic resources.
6. Reduce missed assignments and deadlines.
7. Provide natural-language academic assistance.
8. Combine structured database information with document-based RAG.
9. Build a modular and scalable architecture.
10. Create a foundation for an intelligent university academic ecosystem.

---

# 📸 Screenshots

Add project screenshots here as the application develops.

```text
docs/screenshots/
│
├── login.png
├── dashboard.png
├── semester-selection.png
├── timetable.png
├── assignments.png
├── announcements.png
├── resources.png
└── ai-assistant.png
```

Example:

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

# 🧪 Testing

The system should be tested for:

* Authentication
* Semester selection
* Dashboard data loading
* Timetable accuracy
* Assignment management
* Announcement display
* File/resource access
* AI response accuracy
* Student-specific data isolation
* RAG document retrieval
* API performance

---

# 👥 Project Team

| Name            | Role                     |
| --------------- | ------------------------ |
| **Your Name**   | Project Lead / Developer |
| **Team Member** | Frontend Developer       |
| **Team Member** | Backend Developer        |
| **Team Member** | AI/RAG Developer         |

> Replace the above placeholders with your actual project team members.

---

# 📄 Project Information

**Project Type:** University Major Project
**Domain:** Education Technology / Student Management
**Target Users:** B.Tech Students
**Academic Coverage:** Semester I – Semester VIII
**Core Innovation:** AI-powered Academic Assistant
**Architecture:** Web + Database + AI/RAG

---

# 📜 License

This project is developed for **academic and educational purposes**.

If you choose to release the project as open source, you may use the **MIT License** or another license appropriate for your project.

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 🎓 Smart Academic Management

**One Platform • All Semesters • Smarter Assistance**

> **Smarter Information | Better Learning | Brighter Future**
