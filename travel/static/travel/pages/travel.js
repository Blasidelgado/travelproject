import fetchData from "../util/fetchData.js";

export default async function travelPage(sessionStatus) {
    const pageContainer = document.createElement('section');
    if (!sessionStatus) {
        await loadPage('login');
    }

    pageContainer.innerHTML = `
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
    `

    pageContainer.querySelector('#travel-passenger').onclick = async () => {
        const response = await fetchData('api/permissions');
        const {hasLicense} = response.permissions
        if (hasLicense) {
            console.log('proceed to take date, cities and choose');
        } else {
            generateModal('no-license');
        }
    }

    pageContainer.querySelector('#travel-driver').onclick = async () => {
        const response = await fetchData('api/permissions');
        const {hasLicense, hasCar} = response.permissions
        console.log(hasLicense, hasCar);
        if (!hasLicense) {
            generateModal('no-license');
        } 
        else if (!hasCar) {
            generateModal('no-car');
        }
        else {
            console.log('proceed to take date, cities and choose');
        }
    }
    
    return pageContainer;
}

function generateModal(target) {
    // Modal to show in case user 
    const myModal = new bootstrap.Modal(createModal(target), {
        // Your options go here
        backdrop: 'static',
        keyboard: true
    });

    myModal.show();
}

function createModal(target) {
    const modal = document.createElement('div');
    modal.classList = 'modal fade';
    modal.setAttribute('id', 'myModal');
    let message;
    if (target === 'no-license') {
        message = 'Please add your driver license first.'
    } else {
        message = 'Please complete your car information first.'
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
    `

    modal.querySelector('#load-profile').onclick = () => loadPage('profile')

    return modal;
}