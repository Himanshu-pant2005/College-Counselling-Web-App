# College Counselling Web Application

A complete Django-based College Counselling Web Application with student registration, branch allotment, fee payment, and offer letter generation.

## Features

- **Authentication System**
  - Student & admin sign-up/login
  - Email & password login
  - Google OAuth2 integration
  - Email verification

- **Student Workflow**
  - Profile form with personal and academic details
  - Branch preference selection
  - Branch allotment and acceptance
  - Fee payment with receipt upload
  - Offer letter generation and download

- **Admin Workflow**
  - Seat matrix management
  - Student sorting by marks
  - Branch allotment
  - Payment verification
  - Offer letter generation

- **Email Notifications**
  - Account verification
  - Branch allotment
  - Branch acceptance
  - Receipt verification
  - Offer letter availability

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```
   pip install -r requirements.txt
   ```

3. **Apply migrations**
   ```
   python manage.py migrate
   ```

4. **Create a superuser (admin)**
   ```
   python manage.py createsuperuser
   ```

5. **Run the development server**
   ```
   python manage.py runserver
   ```

6. **Access the application**
   - Main site: http://127.0.0.1:8000/
   - Admin site: http://127.0.0.1:8000/admin/

## Google OAuth2 Setup

1. Create a project in the [Google Developer Console](https://console.developers.google.com/)
2. Enable the Google+ API
3. Create OAuth2 credentials (Web application type)
4. Add authorized redirect URIs:
   - http://127.0.0.1:8000/accounts/google/login/callback/
5. Add your Client ID and Secret to the Django admin:
   - Go to http://127.0.0.1:8000/admin/
   - Navigate to Sites and add your domain
   - Navigate to Social Applications
   - Add a new application with your Google credentials

## Email Configuration

For development, the application uses the console email backend. For production, update the settings.py file with your SMTP configuration:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

## Technologies Used

- Django 4.2.7
- django-allauth for authentication
- TailwindCSS for UI
- ReportLab for PDF generation
- SQLite database (can be switched to PostgreSQL)

## Project Structure

- `college_counselling/` - Main project folder
  - `students/` - Student app with profile, branch selection, and offer letter
  - `admins/` - Admin app with seat matrix and verification functionality
  - `counselling/` - Core app with home page and seat matrix models
  - `templates/` - HTML templates with TailwindCSS
  - `static/` - Static files (CSS, JS)
  - `media/` - Uploaded files (receipts, etc.)