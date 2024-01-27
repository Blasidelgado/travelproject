export default function footerComponent() {
    const footer = document.createElement('footer');
    footer.classList = 'bg-body-tertiary p-2';

    footer.innerHTML = `
          <p id="rights" class="text-center bg-body-tertiary p-3 mb-0" aria-label="Copyright">
            Travel Project <span id="year">${getYear()}</span>. Made by Blas Ignacio Delgado. For CS5O Web Programming Harvard University.
          </p>
    `

    function getYear() {
      return new Date().getFullYear();
    }

    return footer;
}