from django.apps import AppConfig


class ExampleWorkshopConfig(AppConfig):
    name = "example_workshop"
    label = "example_workshop"
    gravewright_urlconf = "example_workshop.urls"

    def ready(self):
        from api.events import resource_changed
        from .hooks import observe
        resource_changed.connect(observe, dispatch_uid="example.server-workshop.observe", weak=False)
