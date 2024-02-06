import { changeAppState } from "../index.js";
import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";

export default async function allJourneys(page=1) {
    
    const container = document.createElement('section');

    // Nav element to navigate through pages
    const pageNav = document.createElement('nav');
    pageNav.innerHTML = `
    <button id="prevPage" type="button">Previous</button>
    <button id="nextPage" type="button">Next</button>`
    
    // Fetch all journeys and show them in a paginated fashion
    const response = await fetchData(`api/travel?page=${page}`);

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

            prevBtn.onclick = async () => await changeAppState("journeys", null, page - 1);
            nextBtn.onclick = async () => await changeAppState("journeys", null, page + 1);
            container.appendChild(pageNav);
        } else {
            container.innerHTML = '<p class="text-center">Could not find any journeys</p>'
        }
    } else {
        console.error(response.message);
    }

    return container;
}
