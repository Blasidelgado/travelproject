import fetchData from "../util/fetchData.js";
import { parseJourneys } from "./journeyDetail.js";

/**
 * Function to fetch specific user scheduled journeys
 */
export default async function userJourneys(sessionStatus) {
    const data = await fetchData('api/travel/user_journeys');

    const container = document.createElement('section');

    const info = parseJourneys(data.journeys);
    info.forEach(journey => container.appendChild(journey));

    return container;
}