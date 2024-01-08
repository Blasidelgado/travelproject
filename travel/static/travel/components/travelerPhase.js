import fetchData from "../util/fetchData.js";
import { parseJourneys } from "../util/parseJourneys.js";

/**
 * Function to change the view of /travel
 * @param {HTMLElement} root
 */
export default async function travelerPhase(root) {
    root.innerHTML = '<h1>I am the second phase</h1>';
    
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
    root.appendChild(journeysContainer);

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
    btn.onclick = async function() {
        journeysContainer.innerHTML = null;
        const origin = container.querySelector('#origin').value;
        const destination = container.querySelector('#destination').value;
        const response = await fetchData(`api/travel/${origin}/${destination}`);
        if (response.success) {
            const availableJourneys = response.journeys;
            const info = await parseJourneys(availableJourneys)
            if (info.length > 0) {
                info.forEach(elem => journeysContainer.appendChild(elem));
            } else {
                journeysContainer.innerHTML = '<p class="text-center">Could not find any journeys</p>'
            }
        } else {
            console.error(response.message);
        }
    }
}