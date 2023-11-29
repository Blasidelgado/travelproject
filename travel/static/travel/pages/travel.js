import travelFirstPhase from "../components/travelFirstPhase.js";
import fetchData from "../util/fetchData.js";

export default async function travelPage(sessionStatus) {
    const pageContainer = document.createElement('section');
    if (!sessionStatus) {
        await loadPage('login');
    }

    let phase = 1;

    if (phase === 1) {
        travelFirstPhase(pageContainer);
    } else {
        console.log('todo');
    }

    return pageContainer;
}
