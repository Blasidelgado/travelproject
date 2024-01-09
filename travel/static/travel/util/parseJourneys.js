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
    actionBtn.innerText = journey.is_passenger? 'Leave' : 'Join';
    actionBtn.onclick = async () => setPassenger(journey.id, journey.is_passenger);

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

async function setPassenger(journeyId, isPassenger) {
    
    const postData = {
        "action": isPassenger ? "leave" : "join"
    }

    const response = await fetch(`api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(postData),
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