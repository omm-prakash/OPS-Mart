# OPS Mart
This repository contains the source code for an E-commerce application. The application is built using Flask for the backend and Vue JS for the front end. The app is a comprehensive multi-user platform designed for efficient grocery shopping. Users can sign up, buy products across various categories, and enjoy role-based access control. With features like category and product management, background jobs, reporting, and alert functionalities, the app ensures a seamless and secure experience for customers, administrators, and store managers alike.

## Table of Contents
- [Tech](#tech)
- [Installation](#installation)
- [Features](#features)
- [User Roles](#user-roles)
- [Functionality](#functionality)
- [Database ER Diagram](#database-er-diagram)
- [Project Directory](#project-directory)
- [Application Snaps](#application-snaps)
- [References](#references)
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

First, make sure you have [Conda](https://docs.conda.io/en/latest/) installed on your system. You may setup your environment using pip. 

##### Create a Conda Environment
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
3. **Store Manager:** Manage products, request new sections and oversee category additions.

## Functionality

- **Category and Product Management:**
  - Add, edit, and delete categories.
  - Manage product details, including ID, name, manufacturing/expiry date, and rate per unit.

- **User Operations:**
  - Sign up and login securely based on RBAC.
  - Purchase products from one or multiple categories.

- **Store Manager Operations:**
  - Sign up and log in with role-specific privileges.
  - Add new products and request the addition of new sections/categories.
  - View the latest products added automatically.

## Database ER Diagram
![er](https://github.com/omm-prakash/OPS-Mart/assets/76400354/dffc2e83-c3ad-4334-b2cf-b5b50de00670)


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
│   ├── snaps/images/ <!-- Frontend snaps/images -->
│   ├── index.js
│   ├── router.js
│   └── style.css
├── templates
│   └── index.html
└── upload_initial_data.py
```

## Application Snaps

### User Landing Page
![image](https://github.com/omm-prakash/OPS-Mart/assets/76400354/c446ed8f-f3d5-4895-a0d2-71d4d7a2be24)

### SignIn Page
![image-1](https://github.com/omm-prakash/OPS-Mart/assets/76400354/3519fa0c-3fbb-4e7c-a39e-beb35a128cf7)

### SignUp Page
![image-2](https://github.com/omm-prakash/OPS-Mart/assets/76400354/6a788c02-910c-4990-a56f-59b871a850c3)

### Customer: Product Dashboard
![image-3](https://github.com/omm-prakash/OPS-Mart/assets/76400354/6c69fb39-5551-4cac-a497-41d743ce6eee)

### Customer: Cart Page
![image-4](https://github.com/omm-prakash/OPS-Mart/assets/76400354/497bc693-1e14-412a-8281-235633d43544)

### Manager: Product Page
![image-6](https://github.com/omm-prakash/OPS-Mart/assets/76400354/55484a8d-5196-4029-bd8a-fedd1d3baf88)

### Admin: Category Page
![image-7](https://github.com/omm-prakash/OPS-Mart/assets/76400354/d8e2a9cc-2dea-448b-80fa-e53c334730d6)

### Admin: Manager Approval Page
![image-8](https://github.com/omm-prakash/OPS-Mart/assets/76400354/6ba9f268-0a5f-44ca-8917-4e973d6819d9)

### Transaction Page
![image-5](https://github.com/omm-prakash/OPS-Mart/assets/76400354/81206399-6084-4d84-a403-61915f90a4e4)

### Customer: Daily Reminder Email 
![image-11](https://github.com/omm-prakash/OPS-Mart/assets/76400354/feeb2f83-ff64-420b-bc2f-683f19ec8fa4)

### Customer: Monthly Transaction Report Email
![image-12](https://github.com/omm-prakash/OPS-Mart/assets/76400354/7db2e948-a213-423f-8ea5-6eb675cdb206)

### Customer: Current Month Transaction Downloadable PDF/HTML Report
![image-10](https://github.com/omm-prakash/OPS-Mart/assets/76400354/b2cfec43-143c-4f75-9e10-d34a6352ffde)


## References
- MAD II Project Study Resources: https://viva-workflow-z5snvc5h3q-el.a.run.app/student/study_resources
- MAD II Playlist: https://www.youtube.com/playlist?list=PLMO2LgIT9_Cfa123DfskneR_zQ4LGAk90
- Vue Js Documentation: https://vuejs.org/guide/introduction.html
- Clerly: https://docs.celeryq.dev/en/stable/
- Flask Documentations

For more details or any clarifications, please feel free to contact me @ommprakash2568@gmail.com.

Thank You,<br>
Omm Prakash Sahoo
