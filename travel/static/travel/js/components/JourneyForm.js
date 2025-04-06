import Modal from './Modal.js';
import Step from './Step.js';
import fetchData from '../utils/fetchData.js';
import { sendNewJourney } from '../utils/sendNewJourney.js';

export default class JourneyForm {
  constructor(container) {
    this.container = container;
    this.newJourneyData = {
      date: null,
      origin: null,
      destination: null,
      available_seats: null,
      seat_price: null,
    };
    this.steps = [];
    this.currentStep = 0;
    this.completedSteps = 0;

    this.init();
  }

  async init() {
    this.modal = new Modal('#newJourneyModal');
    this.modal.show();

    await this.populateCities();
    this.initSteps();
    this.showStep(this.currentStep);
  }

  async populateCities() {
    const response = await fetchData('api/cities');
    if (response.success) {
      const selects = this.container.querySelectorAll('.select-city');
      selects.forEach((select) => {
        response.cities.forEach((city) => {
          const option = document.createElement('option');
          option.value = option.innerText = city;
          select.appendChild(option);
        });
      });
    } else {
      console.error(response.message);
      this.container.innerHTML = '<h2>Something went wrong, please reload the page</h2>';
    }
  }

  initSteps() {
    const stepElements = this.container.querySelectorAll('.step');
    stepElements.forEach((stepElement, index) => {
      const step = new Step(stepElement, index, this);
      this.steps.push(step);
    });

    this.prevBtn = this.container.querySelector('#prevBtn');
    this.nextBtn = this.container.querySelector('#nextBtn');

    this.prevBtn.addEventListener('click', () => this.prevStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
  }

  showStep(stepIndex) {
    this.steps.forEach((step) => step.hide());
    this.steps[stepIndex].show();

    this.prevBtn.disabled = stepIndex === 0;
    this.nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      const currentStep = this.steps[this.currentStep];
      if (currentStep.validate()) {
        this.completedSteps = Math.max(this.completedSteps, this.currentStep);
        this.currentStep++;
        if (this.currentStep === this.steps.length) {
          return sendNewJourney(this.newJourneyData);
        }
        this.showStep(this.currentStep);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }
}