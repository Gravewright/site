import json
from uuid import UUID, uuid4
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from api import Context, actors
from api.errors import AuthError, JournalError, MapError
from .hooks import snapshot


def failure(error):
    code = getattr(error, "code", "invalid_data")
    code = {"not_a_member": "permission_denied", "forbidden": "permission_denied", "invalid_input": "invalid_data"}.get(code, code)
    status = {"permission_denied": 403, "not_found": 404, "conflict": 409}.get(code, getattr(error, "status", 400))
    return JsonResponse({"error": code}, status=status)


@login_required
@require_GET
def read_actors(request, campaign_id):
    try:
        context = Context.from_request(request, campaign_id)
        value = actors.state(context.campaign_id, context.user_id)
        return JsonResponse({"actors": value["actors"], "actorTypes": value["actorTypes"]})
    except (AuthError, JournalError, MapError) as error:
        return failure(error)


@login_required
@require_POST
def rename_actor(request, campaign_id):
    # Normal Django CSRF middleware remains active; never mark this csrf_exempt.
    if len(request.body) > 8192:
        return JsonResponse({"error": "invalid_data"}, status=400)
    try:
        body = json.loads(request.body)
        if not isinstance(body, dict) or set(body) != {"id", "version", "name"}:
            raise ValueError("Invalid payload")
        identifier = str(UUID(body["id"]))
        if not str(body["version"]).isdigit():
            raise ValueError("Invalid version")
        if not isinstance(body["name"], str) or not 2 <= len(body["name"].strip()) <= 120:
            raise ValueError("Invalid name")
        context = Context.from_request(request, campaign_id)
        result = actors.command(context.campaign_id, context.user_id, "actor.update", {
            "id": identifier, "version": body["version"], "name": body["name"].strip(),
        }, uuid4())
        return JsonResponse({"result": result})
    except (ValueError, TypeError, KeyError, AttributeError):
        return JsonResponse({"error": "invalid_data"}, status=400)
    except (AuthError, JournalError, MapError) as error:
        return failure(error)


@login_required
@require_GET
def event_counts(request):
    if request.user.role != "owner":
        return JsonResponse({"error": "permission_denied"}, status=403)
    return JsonResponse({"processLocal": True, "resources": snapshot()})
