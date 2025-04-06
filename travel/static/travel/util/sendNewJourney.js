import getCSRFCookie from "./csrfHandler.js";

export async function sendNewJourney(journeyData) {
    const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFCookie("csrftoken"),
        },
        body: JSON.stringify(journeyData),
    });
    const data = await response.json()
    // Check response
    if (data.success) {
        console.log(data.journey);
    } else {
        console.error('Something went wrong:', data.message)
    }
}
