import fetchData from "../util/fetchData.js";
import getCSRFCookie from "../util/csrfHandler.js";

export default async function newTravel(root) {

    root.innerHTML = `
  <form id="newTravel-form">
    <fieldset class="mb-3">
      <label for="travel-day" class="form-label">Day:</label>
      <input type="date" class="form-control" id="travel-day" aria-describedby="travel-day">
    </fieldset>
    <fieldset class="mb-3">
      <label for="travel-hour" class="form-label">Hour:</label>
      <input type="number" min="0" max="23" class="form-control" id="travel-hour">
      <label for="travel-minutes" class="form-label">Minutes:</label>
      <input type="number" min="0" max="50" step="10" class="form-control" id="travel-minutes">
    </fieldset>
    <fieldset class="mb-3">
      <label for="origin-city" class="form-label">Origin:</label>
      <select id="origin-city" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
      <option selected hidden disabled>Select city</option>
      </select>    
      <label for="destination-city" class="form-label">Destination:</label>
      <select id="destination-city" class="select-city form-select form-select-lg mb-3" aria-label="Select city">
      <option selected hidden disabled>Select city</option>
      </select>
    </fieldset>
    <fieldset>
      <label for="available-seats" class="form-label">Available Seats:</label>
      <input type="number" min="0" max="7" class="form-control" id="available-seats" />
    </fieldset>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
`
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

    root.querySelector('#newTravel-form').addEventListener('submit', async e => {
        e.preventDefault();
        // Get travel date
        const date = new Date(e.target.querySelector('#travel-day').value);
        date.setHours(e.target.querySelector('#travel-hour').value);
        date.setMinutes(e.target.querySelector('#travel-minutes').value);
        // Get origin and destination cities
        const originCity = e.target.querySelector('#origin-city').value;
        const destinationCity = e.target.querySelector('#destination-city').value;
        // Get available seats
        const availableSeats = e.target.querySelector('#available-seats').value;
        // Send data to server
        const response = await fetch('/api/travel', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFCookie("csrftoken"),
          },
          body: JSON.stringify({
            date: date,
            origin: originCity,
            destination: destinationCity,
            available_seats: availableSeats 
          }),
        });
        const data = await response.json()
        // Check response
        if (data.success) {
          console.log(data.journey);
        } else {
          console.error('Something went wrong:', data.message)
        }
    })
}