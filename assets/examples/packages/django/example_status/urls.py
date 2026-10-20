from django.urls import path
from .views import status

urlpatterns = [path("examples/status/", status, name="example_status")]
