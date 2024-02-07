import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";
import pageButtons from "./pageButtons.js";

/**
 * Function to change the view of /travel
 * @param {HTMLElement} root
 */
export default async function travelerPhase(root) {
    root.innerHTML = '<h1>Select your origin and destination cities</h1>';
    
    const container = document.createElement('section');

    const journeysContainer = document.createElement('section');

    container.innerHTML = `
    <div class="input-group mb-3">
    <label class="input-group-text" for="origin">Origin</label>
    <select class="form-select select-city" id="origin">
        <option selected hidden disabled>Select city</option>
    </select>
  </div>
  
  <div class="input-group mb-5">
    <select class="form-select select-city" id="destination">
        <option selected hidden disabled>Select city</option>
    </select>
    <label class="input-group-text" for="destination">Destination</label>
  </div>

  <div class="input-group mb-3 d-flex justify-center">
    <button id="search" class="btn btn-primary" type="button">Search</button>
  </div>
    `

    root.appendChild(container);
    root.appendChild(journeysContainer)

    // Populate select with cities
    const response = await fetchData('api/cities');
    if (response.success) {
        const selects = root.querySelectorAll('.select-city');
        
        selects.forEach(select => {
            response.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = option.innerText = city;
                select.appendChild(option);
            });
        });
    } else {
        console.log(response.message);
        root.innerHTML = '<h2>Something went wrong, please reload the page</h2>';
    }
    
    // Make button do a get request to get query cities
    const btn = root.querySelector('#search');

    // Capture the changes and update state
    const selectedOrigin = container.querySelector('#origin');
    const selectedDestination = container.querySelector('#destination');

    btn.onclick = async () => showJourneys(1, selectedOrigin.value, selectedDestination.value);
        
    
    async function showJourneys(page, origin, destination) {
        journeysContainer.innerHTML = null;

        // Nav element to navigate through pages
        const navBtns = pageButtons();
        
        // Fetch journeys that match queried data
        const response = await fetchData(`api/travel/${origin}/${destination}?page=${page}`);

        if (response.success) {
            const {journeys, hasNext, hasPrev} = response;
            const info = parseJourneys(journeys);
            if (info.length > 0) {
                // Fill container with journeys
                info.forEach(elem => journeysContainer.appendChild(elem));
                
                // Attach event listener to prev and next buttons
                const prevBtn = navBtns.querySelector('#prevPage')
                const nextBtn = navBtns.querySelector('#nextPage')
                
                if (!hasPrev) prevBtn.setAttribute('disabled', hasPrev);
                if (!hasNext) nextBtn.setAttribute('disabled', hasNext);
    
                prevBtn.onclick = () => showJourneys(page - 1, origin, destination);
                nextBtn.onclick = () => showJourneys(page + 1, origin, destination);
                journeysContainer.appendChild(navBtns);
            } else {
                journeysContainer.innerHTML = '<p class="text-center">Could not find any journeys</p>'
            }
        } else {
            console.error(response.message);
        }
    }
}
