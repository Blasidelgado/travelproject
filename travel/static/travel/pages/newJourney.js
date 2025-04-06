import fetchData from "../util/fetchData.js";
import { sendNewJourney } from "../util/sendNewJourney.js";

export default async function newJourneyPage() {
  const container = document.createElement("section");
  container.classList = "container"

  container.innerHTML = `
    <section class="modal fade" id="newJourneyModal" tabindex="-1" role="dialog" aria-labelledby="newJourneyModal">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="newJourneyModalLabel">Fill up your next journey information</h3> 
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="newJourneySteps">
              <ul class="steps">
                <li class="active">Step 1<br><small>Journey day</small></li>
                <li>Step 2<br><small>Journey time</small></li>
                <li>Step 3<br><small>Journey origin/destination</small></li>
                <li>Step 4<br><small>Seats and price</small></li>
                <li>Step 5<br><small>Confirm details</small></li>
              </ul>
              <div class="stepsContent">
                <!-- Step 1 content -->
                <fieldset id="step-1" class="step">
                  <legend>Journey day</legend>
                  <label for="journeyDay" class="form-label">Select a day:</label>
                  <input id="journeyDay" type="date" class="form-control" aria-describedby="journey-day">
                  <p id="journeyDayError" class="error-message" role="alert">Please select a valid journey day</p>
                </fieldset>
                <!-- Step 2 content -->
                <fieldset id="step-2" class="step">
                  <legend>Journey time</legend>
                  <label for="travelHour" class="form-label">Journey hour:</label>
                  <select id="travelHour" class="form-control">
                    <option value="" selected disabled hidden>Select an hour</option>
                  </select>
                  <label for="travelMinutes" class="form-label">Journey minutes:</label>
                  <select id="travelMinutes" class="form-control">
                    <option value="" selected disabled hidden>Select the minutes</option>
                  </select>
                  <small class="text-muted" id="journeyTimeNote" aria-live="polite">
                    Note: The journey must be scheduled at least 24 hours in advance.
                  </small>
                  <p id="journeyTimeError" class="error-message" role="alert">Please select a valid time for the journey</p>
                </fieldset>
                <!-- Step 3 content -->
                <fieldset id="step-3" class="step">
                  <legend>Journey origin and destination</legend>
                  <label for="originCity" class="form-label">Origin:</label>
                  <select id="originCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
                    <option selected hidden disabled>Select city</option>
                  </select>    
                  <label for="destinationCity" class="form-label">Destination:</label>
                  <select id="destinationCity" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
                    <option selected hidden disabled>Select city</option>
                  </select>
                  <p id="journeyCitiesError" class="error-message" role="alert">Please select valid origin and destination cities</p>
                </fieldset>
                <!-- Step 4 content -->
                <fieldset id="step-4" class="step">
                  <legend>Journey seats and price</legend>
                  <label for="availableSeats" class="form-label">Available Seats:</label>
                  <input id="availableSeats" type="number" min="0" max="7" class="form-control"/>
                  <label for="seatPrice" class="form-label">Seat price:</label>
                  <input id="seatPrice" type="number" min="0" max="999" class="form-control"/>
                  <p id="journeySeatsError" class="error-message" role="alert">Please select valid seats count and price</p>
                </fieldset>
                <!-- Step 5: Summary content -->
                <section id="step-5" class="step">
                  <h5>Summary</h3>
                  <div id="summaryContent">
                    <p><strong>Journey Date and Time:</strong> <span id="summaryJourneyDateTime"></span></p>
                    <p><strong>Origin City:</strong> <span id="summaryOriginCity"></span></p>
                    <p><strong>Destination City:</strong> <span id="summaryDestinationCity"></span></p>
                    <p><strong>Available Seats:</strong> <span id="summaryAvailableSeats"></span></p>
                    <p><strong>Seat Price:</strong> <span id="summarySeatPrice"></span></p>
                  </div>
                </section>
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

  // Populate step 3 select with cities
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
  * Handle user input
  */
  const newJourneyData = {
    date: null,
    origin: null,
    destination: null,
    available_seats: null,
    seat_price: null
  }
    
  /**
   * Step 1
  */
  const journeyDayInput = container.querySelector('#journeyDay');
  const journeyDayError = container.querySelector('#journeyDayError');
  // Prevent users selecting past days
  const tomorrow = dateFns.startOfTomorrow();
  const formattedDate = dateFns.format(tomorrow, 'yyyy-MM-dd');
  journeyDayInput.setAttribute('min', formattedDate);
  
  journeyDayInput.addEventListener('change', function() {
    newJourneyData.date = new Date(`${this.value}T00:00:00`);
    journeyDayError.style.visibility = 'hidden';
  });

  /**
   * Step 2
  */
  const journeyHourInput = container.querySelector('#travelHour');
  const journeyMinutesInput = container.querySelector('#travelMinutes');
  const journeyTimeError = container.querySelector('#journeyTimeError');
  // Populate hours select
  for (let value = 0; value < 24; value++) {
    const hr = (value % 12) || 12;
    const period = value < 12 ? "AM" : "PM";
    
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${hr} ${period}`;
  
    journeyHourInput.appendChild(option);
  }
  
  // Populate minutes select
  for (let value = 0; value < 60; value = value + 10) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value > 0 ? value : '0' + value;

    journeyMinutesInput.appendChild(option);
  }

  journeyHourInput.addEventListener('change', function() {
    newJourneyData.date = dateFns.setHours(newJourneyData.date, this.value);
    journeyTimeError.style.visibility = 'hidden';
  })

  journeyMinutesInput.addEventListener('change', function() {
    newJourneyData.date = dateFns.setMinutes(newJourneyData.date, this.value);
    journeyTimeError.style.visibility = 'hidden';
  });
  
  /**
   * Step 3
   */
  const journeyOriginCity = container.querySelector('#originCity');
  const journeyDestinationCity = container.querySelector('#destinationCity');
  const journeyCitiesError = container.querySelector('#journeyCitiesError');

  journeyOriginCity.addEventListener('change', function() {
    newJourneyData.origin = this.value;
    journeyCitiesError.style.visibility = 'hidden';
  });
  
  journeyDestinationCity.addEventListener('change', function() {
    newJourneyData.destination = this.value;
    journeyCitiesError.style.visibility = 'hidden';
  });

  /**
   * Step 4
   */
  const journeySeatsCountInput = container.querySelector('#availableSeats');
  const journeySeatPriceInput = container.querySelector('#seatPrice');
  const journeySeatsError = container.querySelector('#journeySeatsError');

  journeySeatsCountInput.addEventListener('change', function() {
    newJourneyData.available_seats = this.value;
    journeySeatsError.style.visibility = 'hidden';
  });
  
  journeySeatPriceInput.addEventListener('change', function() {
    newJourneyData.seat_price = this.value;
    journeySeatsError.style.visibility = 'hidden';
  });

  /**
   * Step 5 Confirm details
   */
  const summaryJourneyDateTime = container.querySelector('#summaryJourneyDateTime');
  const summaryOriginCity = container.querySelector('#summaryOriginCity');
  const summaryDestinationCity = container.querySelector('#summaryDestinationCity');
  const summaryAvailableSeats = container.querySelector('#summaryAvailableSeats');
  const summarySeatPrice = container.querySelector('#summarySeatPrice');


  /**
  * Modal and steps functionality
  */
  const modalElement = container.querySelector("#newJourneyModal");
  modalElement.classList.add('show');
  modalElement.style.display = 'block';

  let currentStep = 0, completedSteps = 0;
  const steps = container.querySelectorAll('.step');
  const stepLinks = container.querySelectorAll('.steps li');
  const prevBtn = container.querySelector('#prevBtn');
  const nextBtn = container.querySelector('#nextBtn');
  stepLinks.forEach((step, index) => step.onclick = function () {
    if (completedSteps >= index) {
      currentStep = index;
      showStep(currentStep);
    }
  });

  function showStep(stepIndex) {
    steps.forEach(step => step.classList.remove('active'));
    stepLinks.forEach(step => step.classList.remove('active'));

    steps[stepIndex].classList.add('active');
    stepLinks[stepIndex].classList.add('active');

    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === steps.length - 1 ? 'Finish' : 'Next';

    switch (stepIndex) {
      case 0: // Step 1: Journey Day
          if (newJourneyData.date) {
              journeyDayInput.value = dateFns.format(newJourneyData.date, 'yyyy-MM-dd');
          }
          break;

      case 1: // Step 2: Journey Time
          if (newJourneyData.date) {
              journeyHourInput.value = dateFns.getHours(newJourneyData.date);
              journeyMinutesInput.value = dateFns.getMinutes(newJourneyData.date);
          }
          break;

      case 2: // Step 3: Origin and Destination
          if (newJourneyData.origin) {
              journeyOriginCity.value = newJourneyData.origin;
          }
          if (newJourneyData.destination) {
              journeyDestinationCity.value = newJourneyData.destination;
          }
          break;

      case 3: // Step 4: Seats and Price
          if (newJourneyData.available_seats) {
              journeySeatsCountInput.value = newJourneyData.available_seats;
          }
          if (newJourneyData.seat_price) {
              journeySeatPriceInput.value = newJourneyData.seat_price;
          }
          break;

      case 4: // Step 4: Summary
          summaryJourneyDateTime.textContent = `${dateFns.format(newJourneyData.date, 'EEE')} ${dateFns.format(newJourneyData.date, 'MM-dd-yyyy')} ${dateFns.format(newJourneyData.date, 'hh:mm a')}`;
          summaryOriginCity.textContent = newJourneyData.origin;
          summaryDestinationCity.textContent = newJourneyData.destination;
          summaryAvailableSeats.textContent = newJourneyData.available_seats;
          summarySeatPrice.textContent = `$${newJourneyData.seat_price}`;
          break;

      default:
          console.error("Unknown step index:", stepIndex);
          break;
    }
  }

  nextBtn.addEventListener('click', function() {
    if (currentStep < steps.length) {
      switch(currentStep) {
        case 0:
          if (newJourneyData.date && newJourneyData.date >= tomorrow) {
            completedSteps = completedSteps < 0 ? 0 : completedSteps;
            currentStep = 1;
          } else {
            journeyDayError.style.visibility = 'visible';
            completedSteps = -1;
          }
          break;

        case 1:
          if (newJourneyData.date && dateFns.differenceInHours(newJourneyData.date, new Date()) > 24) {
            completedSteps = completedSteps < 1 ? 1 : completedSteps;
            currentStep = 2;
          } else {
            journeyTimeError.style.visibility = 'visible';
            completedSteps = 0;
          }
          break;

        case 2:
          if (newJourneyData.origin && newJourneyData.destination && newJourneyData.origin !== newJourneyData.destination) {
            completedSteps = completedSteps < 2 ? 2 : completedSteps;
            currentStep = 3;
          } else {
            journeyCitiesError.style.visibility = 'visible';
            completedSteps = 1;
          }
          break;

        case 3:
          if (newJourneyData.available_seats && newJourneyData.seat_price) {
            console.log(newJourneyData.available_seats, newJourneyData.seat_price);
            completedSteps = completedSteps < 3 ? 3 : completedSteps;
            currentStep = 4;
          } else {
            journeySeatsError.style.visibility = 'visible';
            completedSteps = 2;
          }
          break;

        case 4: // should be a summary
          return sendNewJourney(newJourneyData);

        default:
          console.log('Something went wrong');
          return;
      }
    }

    console.log('currentStep:', currentStep);
    console.log('completedsteps:', completedSteps);
    console.log(newJourneyData);
    showStep(currentStep);
  });

  prevBtn.addEventListener('click', function() {
    if (currentStep > 0) {
        currentStep--;
    }
    showStep(currentStep);
  });

  console.log(currentStep);
  showStep(currentStep);

  return container;
}
