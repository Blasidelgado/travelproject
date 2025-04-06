export default class Modal {
  constructor(modalId) {
    this.modalElement = document.querySelector(modalId);
  }

  show() {
    this.modalElement.classList.add('show');
    this.modalElement.style.display = 'block';
  }

  hide() {
    this.modalElement.classList.remove('show');
    this.modalElement.style.display = 'none';
  }
}