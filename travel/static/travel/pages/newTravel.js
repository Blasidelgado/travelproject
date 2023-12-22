import fetchData from "../util/fetchData.js";

export default async function newTravel(root) {
    const travelInfo = {
        date: '',
        origin: '',
        destination: '',
        availableSeats: 0
    }

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
      <input type="number" min="0" max="55" step="5" class="form-control" id="travel-minutes">
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

    root.querySelector('#newTravel-form').addEventListener('submit', e => {
        e.preventDefault();
        const day = e.target.querySelector('#travel-day').value
        console.log(day);
    })
}