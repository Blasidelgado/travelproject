export default async function travelPage(sessionStatus) {
    const pageContainer = document.createElement('div');
    const content = sessionStatus ? 'logged in' : 'not logged in';

    pageContainer.innerHTML = `
        <h1>I am the travel page</h1>
    `

    return pageContainer;
}