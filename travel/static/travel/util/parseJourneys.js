/**
 * 
 * @param {*} journeys 
 * @returns Array of html elements
 */
export async function parseJourneys(journeys) {
    return journeys.map(journey => {
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
                    <a href="#" class="btn btn-primary">Join</a>
                </div>
                <div class="card-footer text-muted">
                    ${journey.available_seats} available seats
                </div>
            </div>
        `;

        return wrapper;
    });
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