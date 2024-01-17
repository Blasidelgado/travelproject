import { loadPage } from "../index.js";
import getCSRFCookie from "../util/csrfHandler.js";
import fetchData from "../util/fetchData.js";
import { parseJourney } from "../util/parseJourneys.js";

export default async function journeyDetail(journey_id) {
    const container = document.createElement('section');

    const response = await fetchData(`api/travel/${journey_id}/`);
    const journey = response.journey

    const journeyArt = parseJourney(journey);
    
    const driverStatus = isDriver(journey.driver);
    const passengerStatus = isPassenger(journey.passengers);
    
    const actionBtn = journeyArt.querySelector('.action-btn');
    defineJourney();
    container.appendChild(journeyArt);

    return container;
    
    function defineJourney() {
        if (driverStatus) {
            actionBtn.innerText = 'Cancel journey';
            actionBtn.onclick = async () => cancelJourney(journey.id);
        }
        else if (passengerStatus) {
            actionBtn.innerText = 'Leave';
            actionBtn.onclick = async () => updateJourney(journey.id);
        }
        else {
            actionBtn.innerText = 'Join';
            actionBtn.onclick = async () => updateJourney(journey.id);
        }
    }
}

/**
 * 
 * @param {Array} journeys  
 * @returns {Array} HTML Element journeys
 */
export function parseJourneys(journeys) {
    return journeys.map(journey => parseJourney(journey));
}

async function updateJourney(journeyId) {
        const action = {'action': 'update'}
        const response = await fetch(`api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(action)
      });
      const data = await response.json();

      if (data.success) {
        console.log(data.journey);
        loadPage("journeys", journeyId);
      } else {
        console.log(data.message);
      }
}

async function cancelJourney(journeyId) {
    const action = {'action': 'cancel'}
    const response = await fetch(`api/travel/${journeyId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(action)
      });
      const data = await response.json();

      if (data.success) {
        console.log('success');
        console.log(data.journey);
      }
}


export function isDriver(driver) {
    return driver === sessionStorage.getItem('username')
}

export function isPassenger(passengers) {
    const findUser = passengers.find(userId => userId === parseInt(sessionStorage.getItem('userId')))
    console.log(findUser);
    return !!findUser
}
