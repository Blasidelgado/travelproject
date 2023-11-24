from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import UserProfile

# Create your views here.
def index(request):
    return render(request, "travel/index.html", status=200)


def handle_users(request, username=None):
    if request.method == 'POST':  # Create a new user
        username = request.POST.get('username')
        first_name = request.POST.get('firstName')
        last_name = request.POST.get('lastName')
        password = request.POST.get('password1')
        confirm_password = request.POST.get('password2')

        if password != confirm_password:
            return JsonResponse({'success': False, 'message': 'passwords do not match'}, status=400)

        # TODO more checks here

        form = UserCreationForm({'username': username, 'password1': password, 'password2': password})
        if form.is_valid():
            user = form.save(commit=False)
            user.first_name = first_name
            user.last_name = last_name
            user.save()

            # Create a new UserProfile
            userProfile = UserProfile.objects.create(user=user)

            # Authenticate the user already if success
            login(request, user)

            return JsonResponse({'success': True, 'userId': userProfile.user.id, 'username': userProfile.user.username}, status=201)
        else:
            errors = dict(form.errors.items())
            return JsonResponse({'success': False, 'message': errors}, status=400)
    elif request.method == 'GET':
        if username == None: # Requesting all users
            user_profiles = UserProfile.objects.all()
            users = [user_profile.to_json() for user_profile in user_profiles]

            return JsonResponse({'success': True, 'users':users}, status=200)
        else: #Requesting an individual user
            try:
                user = UserProfile.objects.get(user__username=username).to_json()
                return JsonResponse({'success': True, 'user': user}, status=200)
            except:
                return JsonResponse({'success': False, 'message': 'User not found'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=400)


def handle_login(request): 
    if request.method == 'POST': # Attempt to sign user in
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'userId': user.id, 'username': user.username}, status=201)

        return JsonResponse({'success': False, 'message': 'Incorrect credentials'}, status=401)
    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=400)


def handle_logout(request):
    logout(request)
    return JsonResponse({'success': True, 'message': f'User {request.user} logged out'}, status=200)


def handle_session(request):
    if request.user.is_authenticated:
        return JsonResponse({'success': True}, status=200)
    
    return JsonResponse({'success': False}, status=200)
