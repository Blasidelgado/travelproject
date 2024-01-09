import fetchData from "../util/fetchData.js";
import { parseJourney } from "../util/parseJourneys.js";

export default async function journeyDetail(journey_id) {
    const container = document.createElement('section');

    const response = await fetchData(`api/travel/${journey_id}/`);
    const journey = parseJourney(response.journey);
    container.appendChild(journey);

    return container;
}