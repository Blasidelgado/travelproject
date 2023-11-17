export default async function profilePage(sessionStatus) {
    const pageContainer = document.createElement('div');
    const content = sessionStatus ? 'logged in' : 'not logged in';

    pageContainer.innerHTML = `
        <h1>I am the profile page</h1>
    `

    return pageContainer;
}