# OPS Mart
This repository contains the source code for a E-Commerse application. The application is built using Flask for backend and Vue JS for frontend. The app is a comprehensive multi-user platform designed for efficient grocery shopping. Users can sign up, buy products across various categories, and enjoy role-based access control. With features like category and product management, background jobs, reporting, and alert functionalities, the app ensures a seamless and secure experience for customers, administrators, and store managers alike.

## Table of Contents
- [Tech](#tech)
- [Installation](#installation)
- [Features](#features)
- [User Roles](#user-roles)
- [Functionality](#functionality)
- [Database ER Diagram](#database-er-diagram)
- [Project Directory](#project-directory)
- [Application Snaps](#application-snaps)

## Tech
Some of the major libraries/technologies used for the application. 

- Backend
    - Flask
    - Flask Security
    - Flask Restful
    - Flask SQLAlchemy
    - Flask Cache
    - Celery

- Frontend
    - Dynamic Operation: Vue JS
    - Styling: Bootstrap 
    
## Installation

#### Prerequisites

First make sure you have [Conda](https://docs.conda.io/en/latest/) installed on your system. Neither you may setup your environment using pip. 

##### Create Conda Environment
Use the provided `environment.yml` file to create a Conda environment named "grocery".
```bash
conda env create -f environment.yml
```
##### Activate Conda Environment
```bash
conda activate grocery
```
##### Run the Application
```bash
python main.py
```
##### Run Celery Worker 
```bash
celery -A main:celery_app worker --loglevel INFO 
```
##### Run Celery Beat 
```bash
celery -A main:celery_app beat --loglevel INFO 
```
##### Run MailHog Server
```bash
sudo apt-get -y install golang-go
go install github.com/mailhog/MailHog@latest
~/go/bin/MailHog
```



## Features

- **User Signup and Login:** Secure authentication using Role-Based Access Control (RBAC).
- **Mandatory Admin Login:** Access control for administrators with special privileges.
- **Store Manager Signup and Login:** Role-specific authentication for store managers.
- **Category and Product Management:** Efficiently manage grocery categories and products.
- **Search Functionality:** Easily search for categories and products.
- **Buy Products:** Enable users to purchase products from one or multiple categories.
- **Backend Jobs:** Execute background tasks for improved system performance.
- **Export Jobs:** Export data for reporting and analysis.
- **Reporting Jobs:** Generate reports for insights into grocery sales.
- **Alert Jobs:** Receive alerts for important events or updates.
- **Backend Performance:** Optimize and monitor backend performance.

## User Roles

1. **User:** Regular users who can purchase groceries.
2. **Admin:** Administrators with elevated privileges for system management.
3. **Store Manager:** Manage products, request new sections, and oversee category additions.

## Functionality

- **Category and Product Management:**
  - Add, edit, and delete categories.
  - Manage product details, including ID, name, manufacturing/expiry date, and rate per unit.

- **User Operations:**
  - Sign up and log in securely based on RBAC.
  - Purchase products from one or multiple categories.

- **Store Manager Operations:**
  - Sign up and log in with role-specific privileges.
  - Add new products and request the addition of new sections/categories.
  - View the latest products added automatically.

## Database ER Diagram
![landing page](er.png)

## Project Directory
```html
<!-- root directory -->
.
├── application <!-- Backend code and logic -->
│   ├── cache.py
│   ├── __init__.py
│   ├── models.py <!-- Data model declaration -->
│   ├── __pycache__
│   ├── resources.py <!-- CURD for Category & Product through API call -->
│   ├── sec.py
│   ├── service.py <!-- Email & PDF report generation -->
│   ├── tasks.py <!-- Celery based functionality -->
│   ├── templates/ <!-- Reports and email templates -->
│   ├── utils.py
│   ├── validation.py
│   ├── views.py <!-- All backend management functions -->
│   └── worker.py
├── buffer
├── celeryconfig.py
├── config.py
├── environment.yml
├── instance <!-- Database file -->
│   └── dev.db
├── main.py <!-- Application operating point -->
├── README.md
├── requirements.txt
├── static
│   ├── components <!-- Frontend code and UI components -->
│   │   ├── admin/ <!-- Admin directory -->
│   │   ├── customer/ <!-- Customer directory -->
│   │   ├── home.js
│   │   ├── landing.js
│   │   ├── login.js
│   │   ├── manager/ <!-- Manager directory -->
│   │   ├── navbar.js
│   │   ├── privacy.js
│   │   └── register.js
│   ├── images/ <!-- Frontend images -->
│   ├── index.js
│   ├── router.js
│   └── style.css
├── templates
│   └── index.html
└── upload_initial_data.py
```

## Application Snaps

### User Landing Page
![landing page](image.png)

### SignIn Page
![Alt text](image-1.png)
  
### SignUp Page
![Alt text](image-2.png)

### Customer: Product Dashboard
![Alt text](image-3.png)

### Customer: Cart Page
![Alt text](image-4.png)

### Manager: Product Page
![Alt text](image-6.png)

### Admin: Category Page
![Alt text](image-7.png)

### Admin: Manager Approval Page
![Alt text](image-8.png)

### Transaction Page
![Alt text](image-5.png)

### Customer: Daily Reminder Email 
![Alt text](image-11.png)

### Customer: Monthly Transaction Report Email
![Alt text](image-12.png)

### Customer: Current Month Transaction Downloadable PDF/HTML Report
![Alt text](image-10.png)



For more details or any clarifications please feel free contact me @ 21f1005497@ds.study.iitm.ac.in.

Best Regards,<br>
Omm Prakash Sahoo<br>
21f1005497