import fetchData from "../util/fetchData.js";
import { changeAppState } from "../index.js";
import { loadPage } from "../index.js";


export default async function travelPage(sessionStatus) {
    if (!sessionStatus) {
        await changeAppState('login');
    }

    const container = document.createElement("section");
    container.innerHTML = `
    <div class="py-lg-16 py-10 bg-gray-200">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-md-9 col-12">
                    <h2 class="display-4">Explore the World with Our Community</h2>
                    <p class="lead px-lg-12 mb-6">Embark on a journey of discovery with our vibrant community of travelers. Learning a new skill is hard work—our platform makes it easier for you to connect and share experiences.</p>
                    <div class="d-grid d-md-block">
                        <button id="travel-passenger" class="btn btn-primary mb-3 mb-md-0 mx-md-5">Search for Journeys</button>
                        <button id="travel-driver" class="btn btn-info">Start Your Journey</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    container.querySelector("#travel-passenger").onclick = async () => {
        const response = await fetchData("api/permissions");
        const { hasLicense } = response.permissions;
        if (hasLicense) {
            return changeAppState("travelerPage");
        } else {
            generateModal("no-license");
        }
    };

    container.querySelector("#travel-driver").onclick = async () => {
      const response = await fetchData("api/permissions");
      const { hasLicense, hasCar } = response.permissions;
      if (!hasLicense) {
        generateModal("no-license");
      } else if (!hasCar) {
        generateModal("no-car");
      } else {
        return changeAppState("newJourneyPage");
      }
    };

    return container;
}
  
  let myModal;
  
  function generateModal(target) {
    myModal = new bootstrap.Modal(createModal(target), {
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
        loadPage("profile", sessionStorage.getItem('username'));
    }

    return modal;
}
