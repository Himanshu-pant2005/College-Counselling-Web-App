# Setting up Google Authentication

To enable Google Sign-in/Sign-up, follow these steps:

1. Go to the [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Navigate to "Credentials" and click "Create Credentials" > "OAuth client ID"
4. Select "Web application" as the application type
5. Add the following authorized redirect URIs:
   - http://127.0.0.1:8000/accounts/google/login/callback/
6. Click "Create" and note your Client ID and Client Secret

## Adding credentials to Django Admin

1. Go to http://127.0.0.1:8000/admin/
2. Navigate to "Sites" and edit the existing site or add a new one:
   - Domain name: 127.0.0.1:8000
   - Display name: College Counselling
3. Navigate to "Social Applications" under "Social Accounts"
4. Click "Add Social Application":
   - Provider: Google
   - Name: Google
   - Client ID: [Your Google Client ID]
   - Secret Key: [Your Google Client Secret]
   - Sites: Move your site from "Available sites" to "Chosen sites"
5. Click "Save"

Now Google Sign-in/Sign-up should be working on your login and registration pages.