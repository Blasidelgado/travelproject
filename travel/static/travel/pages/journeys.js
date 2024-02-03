import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";

export default async function allJourneys(postsPage) {
    // Fetch all journeys and show them in a paginated fashion
    const data = await fetchData(`api/travel?page=${postsPage}`);
    const container = document.createElement('section');
    const info = parseJourneys(data.journeys);
    info.forEach(journey => container.appendChild(journey));

    return container;
}
