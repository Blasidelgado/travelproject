from django.forms import ValidationError
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import City, JourneyDetails, UserProfile, Car
import json

# Create your views here.
def index(request):
    return render(request, "travel/index.html", status=200)

def create_user(request):
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


def retrieve_users():
    user_profiles = UserProfile.objects.all()
    users = [user_profile.to_json() for user_profile in user_profiles]

    return JsonResponse({'success': True, 'users':users}, status=200)


def retrieve_user(request, username):
    try:
        user = UserProfile.objects.get(user__username=username).to_json()
        if request.user.username == username:
            return JsonResponse({'success': True, 'user': user, 'isEditable': True}, status=200)
        else:    
            return JsonResponse({'success': True, 'user': user, 'isEditable': False}, status=200)
    except:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=400)
    
def update_user(request):
    data = json.loads(request.body.decode('utf-8'))
    first_name, last_name = data.get('first_name'), data.get('last_name')
    if not first_name or not last_name:
        return JsonResponse({'success': False, 'message': 'Names cannot be empty'}, status=400)
    try:
        userProfile = UserProfile.objects.get(user__username=request.user.username)
        for key, value in data.items(): # Update table depending on provided key
            if key in ['first_name', 'last_name', 'email']:
                setattr(userProfile.user, key, value)
            elif key in ['plate_number', 'brand', 'model']:
                if userProfile.car is None:
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


def handle_users(request, username=None):
    if request.method == 'POST':
        return create_user(request)
    elif request.method == 'GET':
        if username == None:
            return retrieve_users()
        else:
            return retrieve_user(request, username)
    elif request.method == 'PUT':
        return update_user(request)
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
            permissions = {
                'hasLicense': user.has_license(),
                'hasCar': user.has_car()
                }
            
            return JsonResponse({'success': True, 'permissions': permissions}, status=200)
        except: 
            return JsonResponse({'success': False, 'message': 'user not found'}, status=404)

def handle_cities(request):
    try:
        cities = City.objects.all()
        serialized_cities = [city.city_name for city in cities]
        return JsonResponse({'success': True, 'cities': serialized_cities}, status=200)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)
    
def retrieve_specified_journeys(origin_city, destination_city):
    try:
        origin = City.objects.get(city_name=origin_city)
        destination = City.objects.get(city_name=destination_city)

        journeys = JourneyDetails.objects.filter(origin=origin, destination=destination).order_by('date')

        serialized_journeys = [journey.journey_details() for journey in journeys]                    

        return JsonResponse({'success': True, 'journeys': serialized_journeys}, status=200)

    except City.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'City not found.'}, status=404)
    
def retrieve_journey(journey_id, user):
    try:
        selected_journey = JourneyDetails.objects.get(pk=journey_id)
        serialized_journey = selected_journey.journey_details()
        return JsonResponse({'success': True, 'journey': serialized_journey}, status=200)
    except:
        return JsonResponse({'success': False, 'journey': serialized_journey}, status=200)
    
def retrieve_all_journeys():
    try:
        serialized_journeys = [journey.journey_details() for journey in JourneyDetails.objects.all()]
        return JsonResponse({'success': True, 'journeys': serialized_journeys})
    except:
        return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)

def create_journey(request):
    data = json.loads(request.body.decode('utf-8'))

    journey_date = data["date"]
    driver = UserProfile.objects.get(user=request.user)
    origin = City.objects.get(city_name=data["origin"])
    destination = City.objects.get(city_name=data["destination"])

    # Create journey and set journey's driver
    try:
        new_journey = JourneyDetails(
            date=journey_date,
            driver=driver, 
            origin=origin,
            destination=destination, 
            available_seats=data["available_seats"]
        )
        new_journey.full_clean()
        new_journey.save()    

        return JsonResponse({'success': True, 'journey': new_journey.journey_details()})

    # Inform client the validation error
    except ValidationError as e:
        return JsonResponse({'success': False, 'message': dict(e)})            
    except:
        JsonResponse({'success': False, 'message': 'Could not create journey.'})


def update_journey(request, journey_id):
    try:
        user = UserProfile.objects.get(user=request.user)
        journey = JourneyDetails.objects.get(pk=journey_id)

        if user not in journey.passengers.all():
            if journey.available_seats > 0: # Take the seat
                journey.passengers.add(user)
                journey.available_seats -= 1
                journey.save()
                return JsonResponse({'success': True, 'journey': journey}, status=201)
            else:
                return JsonResponse({'success': False, 'message': 'Journey is full'}, status=400)
                        
        else: # Free the seat
            journey.passengers.remove(user)
            journey.available_seats += 1
            journey.save()
            return JsonResponse({'success': True, 'journey': journey}, status=201)
    except UserProfile.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
    except JourneyDetails.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Journey not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


def delete_journey(request, journey_id):
    try:
        user = UserProfile.objects.get(user=request.user)
        journey = JourneyDetails.objects.get(pk=journey_id)
        if journey.driver == user:
            #Delete the journey
            journey.delete()
            return JsonResponse({'success': True, 'message': 'Journey deleted succesfully'}, status=200)
        else:
            return JsonResponse({'success': False, 'message': 'Not allowed'}, status=403)

    except UserProfile.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
    except JourneyDetails.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Journey not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


def handle_travel(request, journey_id=None, origin_city=None, destination_city=None):
    if request.method == 'GET':
        user = UserProfile.objects.get(user=request.user)
        if origin_city and destination_city:
            return retrieve_specified_journeys(origin_city, destination_city)
        elif journey_id:
            return retrieve_journey(journey_id, user)
        else:
            return retrieve_all_journeys()
    elif request.method == 'POST':
        return create_journey(request)
    elif request.method == 'PUT':
        return update_journey(request, journey_id)
    elif request.method == 'DELETE':
        return delete_journey(request, journey_id)
    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=400)