import JourneyForm from '../components/JourneyForm.js';

export default function newJourneyPage() {
  const container = document.querySelector('#app');
  const journeyForm = new JourneyForm(container);
}