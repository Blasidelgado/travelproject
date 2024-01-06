import { loadPage } from "../index.js";
import fetchData from "../util/fetchData.js";

export default async function allJourneys(sessionStatus) {
    if (!sessionStatus) {
        await loadPage('login')
    }

    const data = await fetchData('api/travel');
    // Format date
    const container = document.createElement('section');
    const info = await parseJourneys(data.journeys);
    info.forEach(journey => container.appendChild(journey));

    return container;
}

async function parseJourneys(journeys) {
    // Utiliza map para crear un nuevo array de elementos HTML
    return journeys.map(journey => {
        const wrapper = document.createElement('article');
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

function parseDate(unformattedDate) {
    const date = new Date(unformattedDate);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    // Formatear la fecha en el formato deseado (por ejemplo, DD/MM/YYYY HH:mm)
    const formattedDate = `${day}/${month}/${year} ${hour}:${minutes}`;

    // Usar fechaFormateada según tus necesidades
    return formattedDate;
}