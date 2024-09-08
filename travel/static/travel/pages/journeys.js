import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";
import pageButtons from "../components/pageButtons.js";
import checkSessionStatus from "../util/handleSession.js";

export default async function allJourneys(navigateTo, page=1) {
    const container = document.createElement('section');

    // Nav element to navigate through pages
    const navBtns = pageButtons();
    
    // Fetch all journeys and show them in a paginated fashion
    const response = await fetchData(`api/travel?page=${page}`);

    if (response.success) {
        const {journeys, hasNext, hasPrevious} = response;
        const info = parseJourneys(journeys, navigateTo);
        if (info.length > 0) {
            // Fill container with journeys
            info.forEach(elem => container.appendChild(elem));
            
            // Attach event listener to prev and next buttons
            const prevBtn = navBtns.querySelector('#prevPage')
            const nextBtn = navBtns.querySelector('#nextPage')

            // Add corresponding action to journey buttons
            container.querySelectorAll('.action-btn').forEach(async btn => {
                btn.onclick = await checkSessionStatus() ? 
                () => navigateTo('/journey', btn.dataset.id) :
                () => navigateTo('/login'); 
            })

            // Handle prov / next buttons
            if (!hasPrevious) prevBtn.setAttribute('disabled', hasPrevious);
            if (!hasNext) nextBtn.setAttribute('disabled', hasNext);

            prevBtn.onclick = async () => await navigateTo('/journeys', parseInt(page) - 1);
            nextBtn.onclick = async () => await navigateTo('/journeys', parseInt(page) + 1);
            container.appendChild(navBtns);
        } else {
            // Handle empty journeys case
            container.innerHTML = '<p class="text-center">Could not find any journeys</p>'
        }
    } else {
        console.error(response.message);
    }

    return container;
}
