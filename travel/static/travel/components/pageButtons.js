export default function pageButtons() {
    const container = document.createElement('div');
    container.innerHTML = `
    <nav style="display:flex; justify-content: center; gap: 1em; margin-top: 1em;">
    <button id="prevPage" class="btn btn-primary" type="button">Previous</button>
    <button id="nextPage" class="btn btn-primary" type="button">Next</button>
    </nav>`;

    return container;
}