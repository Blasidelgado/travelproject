import { loadPage } from "../index.js";
import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";

export default async function allJourneys(sessionStatus) {
    if (!sessionStatus) {
        await loadPage('login')
    }

    // Fetch all journeys and show
    const data = await fetchData('api/travel');
    const container = document.createElement('section');
    const info = parseJourneys(data.journeys);
    info.forEach(journey => container.appendChild(journey));

    return container;
}
