from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import UserProfile, Car
import json

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
                if request.user.username == username:
                    return JsonResponse({'success': True, 'user': user, 'isEditable': True}, status=200)
                else:    
                    return JsonResponse({'success': True, 'user': user, 'isEditable': False}, status=200)
            except:
                return JsonResponse({'success': False, 'message': 'User not found'}, status=400)
    elif request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        first_name, last_name = data.get('first_name'), data.get('last_name')
        if not first_name or not last_name:
            return JsonResponse({'success': False, 'message': 'Names cannot be empty'}, status=400)
        try:
            userProfile = UserProfile.objects.get(user__username=request.user.username)
            for key, value in data.items():
                if key in ['first_name', 'last_name', 'email']:
                    setattr(userProfile.user, key, value)
                elif key in ['plate_number', 'brand', 'model']:
                    if userProfile.car is None: # Create car if new
                        userProfile.car = Car.objects.create()
                    setattr(userProfile.car, key, value)
                else:
                    setattr(userProfile, key, value)

            userProfile.user.save()
            userProfile.car.save()
            userProfile.save()

            return JsonResponse({'success': True, 'user': userProfile.to_json(), 'isEditable': True}, status=201)
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Unauthorized'}, status=403)

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


def handle_permissions(request):
    if request.method == 'GET':
        try:
            user = UserProfile.objects.get(user=request.user)
            print(user.has_license(), user.has_car())
            permissions = {
                'hasLicense': user.has_license(),
                'hasCar': user.has_car()
                }
            
            return JsonResponse({'success': True, 'permissions': permissions}, status=200)
        except: JsonResponse({'success': False, 'message': 'user not found'}, status=404)
