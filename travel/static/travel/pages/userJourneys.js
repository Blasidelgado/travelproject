import fetchData from "../util/fetchData.js";
import { parseJourneys } from "./journeyDetail.js";
import { changeAppState } from "../index.js";

/**
 * Function to fetch specific user scheduled journeys
 */
export default async function userJourneys(page=1) {
    const container = document.createElement('section');

    // Nav element to navigate through pages
    const pageNav = document.createElement('nav');
    pageNav.innerHTML = `
    <button id="prevPage" type="button">Previous</button>
    <button id="nextPage" type="button">Next</button>`

    const response = await fetchData(`api/travel/user_journeys?page=${page}`);

    if (response.success) {
        const {journeys, hasNext, hasPrevious} = response;
        const info = parseJourneys(journeys);
        if (info.length > 0) {
            // Fill container with journeys
            info.forEach(elem => container.appendChild(elem));
            
            // Attach event listener to prev and next buttons
            const prevBtn = pageNav.querySelector('#prevPage')
            const nextBtn = pageNav.querySelector('#nextPage')
            
            if (!hasPrevious) prevBtn.setAttribute('disabled', hasPrevious);
            if (!hasNext) nextBtn.setAttribute('disabled', hasNext);

            prevBtn.onclick = async () => await changeAppState("userJourneys", null, page - 1);
            nextBtn.onclick = async () => await changeAppState("userJourneys", null, page + 1);
            container.appendChild(pageNav);
        } else {
            container.innerHTML = '<p class="text-center">Could not find any journeys</p>'
        }
    } else {
        console.error(response.message);
    }

    return container;
}