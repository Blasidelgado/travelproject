import checkSessionStatus from "./handleSession.js";

/**
 * 
 * @param {Object} journey 
 * @returns {HTMLElement} Journey
 */
export function parseJourney(journey, navigateTo) {
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
            <div class="card-body ${journey.isActive? 'bg-light' : 'bg-danger'}">
                <h5 class="card-title">${parseDate(journey.date)}</h5>
                <p class="card-text">Driver: <span class="driver-profile">${journey.driver}</span></p>
                <p class="card-text">Seat price: ${journey.seat_price}</p>
                <p class="card-text">Status: ${journey.isActive ? "active" : "cancelled"}</p>
                <btn data-id=${journey.id} type='button' class="action-btn btn btn-primary"></btn>
            </div>
            <div class="card-footer text-muted">
                ${journey.isActive ? `${journey.available_seats} available seats`: ''}
            </div>
        </div>
    `;

    wrapper.querySelector('.driver-profile').onclick = async () => navigateTo(
                                                await checkSessionStatus() ? ('/profile', journey.driver) :
                                                '/login'
                                            );
    const actionBtn = wrapper.querySelector('.action-btn');

    actionBtn.innerText = 'See details';

    return wrapper;
}

/**
 * 
 * @param {Array} journeys  
 * @returns {Array} HTML Element journeys
 */
export function parseJourneys(journeys, navigateTo) {
    return journeys.map(journey => parseJourney(journey, navigateTo));
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
