"""
WSGI config for college_counselling project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_counselling.settings')

application = get_wsgi_application()