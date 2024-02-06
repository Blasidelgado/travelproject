import { changeAppState, loadPage } from "../index.js";
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

    // If journey is not active, do not display action button
    if (!journey.isActive) {
      journeyArt.querySelector('.card-body').removeChild(actionBtn);
    } else {
      defineJourney();
    }
    container.appendChild(journeyArt);

    return container;
    
    /**
     * Handler function to attach events to the action button
     * 
     * 
     */
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
 * Function to parse journey objects into HTML Elements
 * @param {object[]} journeys  
 * @returns {HTMLElement[]}
 */
export function parseJourneys(journeys) {
    return journeys.map(journey => parseJourney(journey));
}

/**
 * Function to change the passengers status
 * @param {number} journeyId
 * 
 */
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
        // Take user back to /userJourneys page
        changeAppState("userJourneys");
      } else {
        console.log(data.message);
      }
}

/**
 * Function to cancel a journey
 * @param {number} journeyId 
 * 
 */
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
        // Take user back to /userJourneys page
        changeAppState("userJourneys");
      } else {
        console.log(data.message);
      }
}

/**
 * Function to check if current user is a driver of a journey
 * @param {string} driver Driver's username 
 * @returns {boolean} 
 */
export function isDriver(driver) {
    return driver === sessionStorage.getItem('username')
}

/**
 * Function to check if current is passenger of a journey
 * @param {number[]} passengers 
 * @returns {boolean}
 */
export function isPassenger(passengers) {
    const findUser = passengers.find(userId => userId === parseInt(sessionStorage.getItem('userId')))
    return !!findUser
}
