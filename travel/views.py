from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from .models import UserProfile

# Create your views here.
def index(request):
    return render(request, "travel/index.html", status=200)


def handle_users(request, user_id):
    if request.method == 'POST':  # Create a new user
        username = request.POST.get('username')
        password = request.POST.get('password1')
        confirm_password = request.POST.get('password2')

        if password != confirm_password:
            return JsonResponse({'success': False, 'message': 'passwords does not match'}, status=400)

        # TODO more checks here

        form = UserCreationForm({'username': username, 'password1': password, 'password2': password})
        if form.is_valid():
            user = form.save()

            # Create a new UserProfile
            userProfile = UserProfile.objects.create(user=user)

            # Authenticate the user already if success
            login(request, user)

            return JsonResponse({'success': True, 'userId': userProfile.user.id, 'username': userProfile.user.username}, status=201)
        else:
            errors = dict(form.errors.items())
            return JsonResponse({'success': False, 'message': errors}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=400)
