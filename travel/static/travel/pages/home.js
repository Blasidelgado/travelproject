import checkSessionStatus from "../util/handleSession.js";

export default async function homePage() {
    const homeContainer = document.createElement('div');
    const content = await checkSessionStatus() ? 'logged in' : 'not logged in';

    homeContainer.innerHTML = `
        <h1>I am the homepage</h1>
        <h3>User is ${content}</h3>
    `

    return homeContainer;
}