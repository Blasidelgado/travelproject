import getCSRFCookie from "./csrfHandler.js";

/**
 * 
 * @param {Object} journey 
 * @returns {HTMLElement} Journey
 */
export function parseJourney(journey) {
    const wrapper = document.createElement('article');
    wrapper.dataset.id = journey.id;
    wrapper.dataset.origin = journey.origin;
    wrapper.dataset.destination = journey.destination;
    wrapper.dataset.seats = journey.available_seats;

    const driverStatus = isDriver(journey.driver);
    const passengerStatus = isPassenger(journey.passengers);

    wrapper.innerHTML = `
        <div class="card text-center">
            <div class="card-header">
                ${journey.origin} to ${journey.destination}
            </div>
            <div class="card-body">
                <h5 class="card-title">${parseDate(journey.date)}</h5>
                <p class="card-text">Driver: ${journey.driver}</p>
                <btn type='button' class="action-btn btn btn-primary"></btn>
            </div>
            <div class="card-footer text-muted">
                ${journey.available_seats} available seats
            </div>
        </div>
    `;

    const actionBtn = wrapper.querySelector('.action-btn');
    if (driverStatus) {
        actionBtn.innerText = 'Delete journey';
        actionBtn.onclick = async () => deleteJourney(journey.id);
    }
    else if (passengerStatus) {
        actionBtn.innerText = 'Leave';
        actionBtn.onclick = async () => updateJourney(journey.id);
    }
    else {
        actionBtn.innerText = 'Join';
        actionBtn.onclick = async () => updateJourney(journey.id);
    }

    return wrapper;
}

/**
 * 
 * @param {Array} journeys  
 * @returns {Array} HTML Element journeys
 */
export function parseJourneys(journeys) {
    return journeys.map(journey => parseJourney(journey));
}

async function updateJourney(journeyId) {
        const response = await fetch(`api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log('success');
        console.log(data.journey);
      }
}

async function deleteJourney(journeyId) {
    const response = await fetch(`api/travel/${journeyId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
      });
      const data = await response.json();

      if (data.success) {
        console.log('success');
        console.log(data.journey);
      }
}

/**
 * 
 * @param {*} unformattedDate 
 * @returns {string} Formatted date
 */
export function parseDate(unformattedDate) {
    const date = new Date(unformattedDate);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    const formattedDate = `${day}/${month}/${year} ${hour}:${minutes}`;

    return formattedDate;
}

export function isDriver(driver) {
    return driver === sessionStorage.getItem('username')
}

export function isPassenger(journey) {
    const findUser = journey.find(userId => userId === sessionStorage.getItem('userId'))
    return !!findUser
}