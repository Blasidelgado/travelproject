export default class Step {
  constructor(stepElement, index, form) {
    this.stepElement = stepElement;
    this.index = index;
    this.form = form;
  }

  show() {
    this.stepElement.classList.add('active');
  }

  hide() {
    this.stepElement.classList.remove('active');
  }

  validate() {
    // Add validation logic for this step
    return true;
  }
}