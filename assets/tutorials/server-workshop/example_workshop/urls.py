from django.urls import path
from . import views

urlpatterns = [
    path("api/tutorials/campaign/<uuid:campaign_id>/actors/", views.read_actors),
    path("api/tutorials/campaign/<uuid:campaign_id>/rename/", views.rename_actor),
    path("api/tutorials/event-counts/", views.event_counts),
]
