import fetchData from "../util/fetchData.js";
import { parseJourneys } from "./journeyDetail.js";
import { changeAppState } from "../index.js";
import pageButtons from "../components/pageButtons.js";

/**
 * Function to fetch specific user scheduled journeys
 */
export default async function userJourneys(page=1) {
    const container = document.createElement('section');

    // Nav element to navigate through pages
    const navBtns = pageButtons();

    const response = await fetchData(`api/travel/user_journeys?page=${page}`);

    if (response.success) {
        const {journeys, hasNext, hasPrevious} = response;
        const info = parseJourneys(journeys);
        if (info.length > 0) {
            // Fill container with journeys
            info.forEach(elem => container.appendChild(elem));

            // Add corresponding action to journey buttons
            container.querySelectorAll('.action-btn').forEach(async btn => {
                btn.onclick = () => changeAppState("journey", btn.dataset.id) 
            })
            
            // Attach event listener to prev and next buttons
            const prevBtn = navBtns.querySelector('#prevPage')
            const nextBtn = navBtns.querySelector('#nextPage')
            
            if (!hasPrevious) prevBtn.setAttribute('disabled', hasPrevious);
            if (!hasNext) nextBtn.setAttribute('disabled', hasNext);

            prevBtn.onclick = async () => await changeAppState("userJourneys", null, page - 1);
            nextBtn.onclick = async () => await changeAppState("userJourneys", null, page + 1);
            container.appendChild(navBtns);
        } else {
            container.innerHTML = '<p class="text-center">Could not find any journeys</p>'
        }
    } else {
        console.error(response.message);
    }

    return container;
}