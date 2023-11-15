export default async function homePage(sessionStatus) {
    const homeContainer = document.createElement('div');
    const content = sessionStatus ? 'logged in' : 'not logged in';

    homeContainer.innerHTML = `
        <h1>I am the homepage</h1>
        <h3>User is ${content}</h3>
    `

    return homeContainer;
}