from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from api import API_VERSION


@login_required
@require_GET
def status(request):
    if request.user.role != "owner":
        return JsonResponse({"error": "permission_denied"}, status=403)
    return JsonResponse({"ok": True, "apiVersion": API_VERSION})
