import travelFirstPhase from "../components/travelFirstPhase.js";

export default async function travelPage(sessionStatus) {
    if (!sessionStatus) {
        await loadPage('login');
    }
    const pageContainer = document.createElement('section');
    
    travelFirstPhase(pageContainer);

    return pageContainer;
}
