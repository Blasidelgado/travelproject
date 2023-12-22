import { appState, loadPage } from "../index.js";
import newTravel from "../pages/newTravel.js";
import travelPage from "../pages/travel.js";
import fetchData from "../util/fetchData.js";
import travelerPhase from "./travelerPhase.js";

export default function travelFirstPhase(root) {
  root.innerHTML = `
    <div class="page-container">
        <div class="travel-cto">
            <div class="travel-card passenger">
                <p>I am a passenger</p>
                <button id="travel-passenger">Start</button>
            </div>
            <div class="travel-card driver">
                <p>I am a driver</p>
                <button id="travel-driver">Start</button>
            </div>
        </div>
    </div>
`;

  root.querySelector("#travel-passenger").onclick = async () => {
    const response = await fetchData("api/permissions");
    const { hasLicense } = response.permissions;
    if (hasLicense) {
      return travelerPhase(root);
    } else {
      generateModal("no-license");
    }
  };

  root.querySelector("#travel-driver").onclick = async () => {
    const response = await fetchData("api/permissions");
    const { hasLicense, hasCar } = response.permissions;
    if (!hasLicense) {
      generateModal("no-license");
    } else if (!hasCar) {
      generateModal("no-car");
    } else {
      newTravel(root);
    }
  };
}

let myModal;

function generateModal(target) {
  // Modal to show in case user
  myModal = new bootstrap.Modal(createModal(target), {
    // Your options go here
    backdrop: "static",
    keyboard: true,
  });

  myModal.show();
}

function createModal(target) {
  const modal = document.createElement("div");
  modal.classList = "modal fade";
  modal.setAttribute("id", "myModal");
  let message;
  if (target === "no-license") {
    message = "Please add your driver license first.";
  } else {
    message = "Please complete your car information first.";
  }

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">${message}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button id="load-profile" type="button" class="btn btn-primary">Go to profile</button>
            </div>
        </div>
    </div>
`;

  modal.querySelector("#load-profile").onclick = () => {
    myModal.hide();
    loadPage("profile", sessionStorage.getItem('user'));
  }

  return modal;
}
