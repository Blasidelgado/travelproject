import fetchData from "../util/fetchData.js";
import getCSRFCookie from "../util/csrfHandler.js";

export default async function newJourneyPage() {
  const container = document.createElement("section");
  container.classList = "container"

  container.innerHTML = `
    <section class="modal fade" id="newTravelModal" tabindex="-1" role="dialog" aria-labelledby="newTravelModalLavel">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="newTravelModalLabel">Fill up your next journey information</h3> 
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="newTravelSteps">
              <ul class="steps">
                <li class="active"><a href="#step-1">Step 1<br><small>Travel day</small></a></li>
                <li><a href="#step-2">Step 2<br><small>Travel time</small></a></li>
                <li><a href="#step-3">Step 3<br><small>Travel origin/destination</small></a></li>
                <li><a href="#step-4">Step 4<br><small>Seats and price</small></a></li>
                <li><a href="#step-5">Step 5<br><small>Confirm details</small></a></li>
              </ul>
              <div class="stepsContent">
                <!-- Step 1 content -->
                <div id="step-1" class="step">
                  <label for="travelDay" class="form-label">Select your journey day:</label>
                  <input id="travelDay" type="date" class="form-control" aria-describedby="travel-day">
                </div>
                <!-- Step 2 content -->
                <div id="step-2" class="step">
                  <label for="travelHour" class="form-label">Journey hour:</label>
                  <select id="travelHour" class="form-control">
                    <option value="" selected disabled hidden>Select an hour</option>
                  </select>
                  <label for="travelMinutes" class="form-label">Journey minutes:</label>
                  <select id="travelMinutes" class="form-control">
                    <option value="" selected disabled hidden>Select the minutes</option>
                  </select>
                </div>
                <!-- Step 3 content -->
                <div id="step-3" class="step">
                  <label for="originCity" class="form-label">Origin:</label>
                  <select id="originCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
                    <option selected hidden disabled>Select city</option>
                  </select>    
                  <label for="destinationCity" class="form-label">Destination:</label>
                  <select id="destinationCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
                    <option selected hidden disabled>Select city</option>
                  </select>
                </div>
                <!-- Step 4 content -->
                <div id="step-4" class="step">
                  <label for="availableSeats" class="form-label">Available Seats:</label>
                  <input id="availableSeats" type="number" min="0" max="7" class="form-control"/>
                  <label for="seatPrice" class="form-label">Seat price:</label>
                  <input id="seatPrice" type="number" min="0" max="999" class="form-control"/>
                </div>
                <div id="step-5" class="step">
                  <p>Here a detail of your information will be display.</p>
                </div>
              </div>
              <div class="wizard-buttons">
                <button id="prevBtn" disabled>Previous</button>
                <button id="nextBtn">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `

  // Prevent users selecting past days
  container.querySelector('#travelDay').setAttribute('min', generateTomorrowDate());

  // Populate select with cities
  const response = await fetchData('api/cities');
  if (response.success) {
      const selects = container.querySelectorAll('.select-city');

      selects.forEach(select => {
          response.cities.forEach(city => {
              const option = document.createElement('option');
              option.value = option.innerText = city;
              select.appendChild(option);
          });
      });
  } else {
      console.error(response.message);
      container.innerHTML = '<h2>Something went wrong, please reload the page</h2>';
  }

  /**
  * Data management block
  */
  const newJourneyData = {
    day: null,
    hours: null,
    minutes: null,
    originCity: null,
    destinationCity: null,
    availableSeats: null,
    seatPrice: null
  }

  const journeyDayInput = container.querySelector('#travelDay');
  const journeyHourInput = container.querySelector('#travelHour');
  const journeyMinutesInput = container.querySelector('#travelMinutes');
  const journeyOriginCity = container.querySelector('#originCity');
  const journeyDestinationCity = container.querySelector('#destinationCity');
  const journeySeatsInput = container.querySelector('#availableSeats');
  const journeyPriceInput = container.querySelector('#seatPrice');
  
  /**
   * Step 1 logic & validation
  */
  journeyDayInput.addEventListener('change', function() {
    newJourneyData.day = new Date(`${this.value}T00:00:00`);
  });

  /**
   * Step 2 logic & validation
  */
  for (let value = 0; value < 24; value++) {
    const hr = (value % 12) || 12;
    const period = value < 12 ? "AM" : "PM";
    
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${hr} ${period}`;
  
    journeyHourInput.appendChild(option);
  }

  for (let value = 0; value < 60; value = value + 10) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value > 0 ? value : '0' + value;

    journeyMinutesInput.appendChild(option);
  }

  journeyHourInput.addEventListener('change', function() {
    newJourneyData.hours = this.value;
  })

  journeyMinutesInput.addEventListener('change', function() {
    newJourneyData.minutes = this.value;
  });

  /**
   * Step 3 logic & validation
   */

  journeyOriginCity.addEventListener('change', function() {
    newJourneyData.originCity = this.value;
  });

  journeyDestinationCity.addEventListener('change', function() {
    newJourneyData.destinationCity = this.value;
  });

    // form.querySelector('#newTravel-form').addEventListener('submit', async e => {
    //     e.preventDefault();
                
    //     // Asegúrate de que las horas y minutos sean válidos
    //     const hours = parseInt(e.target.querySelector('#travel-hour').value);
    //     const minutes = parseInt(e.target.querySelector('#travel-minutes').value);
    
    //     if (!isNaN(hours) && !isNaN(minutes)) {
    //         date.setHours(hours);
    //         date.setMinutes(minutes);

    //         console.log(date);
    //         } else {
    //         console.error('Invalid hours or minutes');
    //         return;
    //     }
    //     // Get origin and destination cities
    //     const originCity = e.target.querySelector('#origin-city').value;
    //     const destinationCity = e.target.querySelector('#destination-city').value;
    //     // Get available seats
    //     const availableSeats = e.target.querySelector('#available-seats').value;
    //     const seatPrice = e.target.querySelector('#seat-price').value;
    //     // Send data to server
    //     const response = await fetch('/api/travel', {
    //       method: 'POST',
    //       headers: {
    //         "Content-Type": "application/json",
    //         "X-CSRFToken": getCSRFCookie("csrftoken"),
    //       },
    //       body: JSON.stringify({
    //         date: date,
    //         origin: originCity,
    //         destination: destinationCity,
    //         available_seats: availableSeats,
    //         seat_price: seatPrice
    //       }),
    //     });
    //     const data = await response.json()
    //     // Check response
    //     if (data.success) {
    //       console.log(data.journey);
    //     } else {
    //       console.error('Something went wrong:', data.message)
    //     }
    // })

  /**
  * Modal and steps functionality
  */
  const modalElement = container.querySelector("#newTravelModal");
  modalElement.classList.add('show');
  modalElement.style.display = 'block';

  let currentStep = 0;
  const steps = container.querySelectorAll('.step');
  const stepLinks = container.querySelectorAll('.steps li');
  const prevBtn = container.querySelector('#prevBtn');
  const nextBtn = container.querySelector('#nextBtn');

  function showStep(stepIndex) {
    steps.forEach(step => step.classList.remove('active'));
    stepLinks.forEach(step => step.classList.remove('active'));

    steps[stepIndex].classList.add('active');
    stepLinks[stepIndex].classList.add('active');

    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === steps.length - 1 ? 'Finish' : 'Next';
  }

  nextBtn.addEventListener('click', function() {
    if (currentStep < steps.length - 1) {
      console.log(currentStep);
      console.log(newJourneyData);
      switch(currentStep) {
        case 0:
          newJourneyData.day && currentStep++;
          break;
        case 1:
          newJourneyData.hours && newJourneyData.minutes && currentStep++;
          break;
        case 2:
          newJourneyData.originCity && newJourneyData.destinationCity && newJourneyData.originCity !== newJourneyData.destinationCity && currentStep++;
          break;
        default:
          console.log('Something went wrong');
          return;
      }
    } else {
        alert('Form submitted!');
        return;
    }
    showStep(currentStep);
  });

  prevBtn.addEventListener('click', function() {
    if (currentStep > 0) {
        currentStep--;
    }
    showStep(currentStep);
  });

  showStep(currentStep);

  return container;
}


function generateTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const day = tomorrow.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}
