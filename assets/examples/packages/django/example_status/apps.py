from django.apps import AppConfig


class ExampleStatusConfig(AppConfig):
    name = "example_status"
    label = "example_status"
    gravewright_urlconf = "example_status.urls"
