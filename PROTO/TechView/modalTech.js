const overlay = document.getElementById('overlay');

// Function to handle click events on buttons
function handleButtonClick(event) {
  const button = event.target.closest('button[data-modal-target]');
  if (!button) return;

  const avail = button.classList.contains('reserved')

  const modalId = button.getAttribute('data-modal-target');
  const modal = document.querySelector(modalId);

  const id = button.getAttribute('id');

  if(!avail){
    addAttReserve(id);
    const modalId = button.getAttribute('data-modal-target');
    const modal = document.querySelector(modalId);
    // Change title when button is clicked
    const title = modal.querySelector('.modal-header #title');
    if (title) {
      title.textContent = id; // Change this to the desired title
    }
    openModal(modal);
  } else {
    removeReserve(id);
    const modalId = "#modalB";
    const modal = document.querySelector(modalId);
    // Change title when button is clicked
    const title = modal.querySelector('.modal-header #title');
    if (title) {
      title.textContent = id; // Change this to the desired title
    }
    openModal(modal);
    
  }

}

function addAttReserve(id){
  let button = document.getElementById("reserve");
  button.setAttribute("onclick", 'changeAvailability("' + id + '")');
}

function removeReserve(id){
  let button = document.getElementById("close");
  button.setAttribute("onclick", 'changeAvailability("' + id + '")');
}


// Event listener for button clicks
document.addEventListener('click', handleButtonClick);

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');
  modals.forEach(modal => {
    closeModal(modal);
  });
});

// Event listener for closeModalButtons
document.addEventListener('click', event => {
  const closeButton = event.target.closest('[data-reserve-button]');
  if (closeButton) {
    const modal = closeButton.closest('.modal');
    closeModal(modal);

  }
});

document.addEventListener('click', event => {
  const closeButton = event.target.closest('[data-cancel-button]');
  if (closeButton) {
    const modal = closeButton.closest('.modal');
    closeModal(modal);

  }
});
// Event listener for closeModalButtons
document.addEventListener('click', event => {
  const closeButton = event.target.closest('[data-close-button]');
  if (closeButton) {
    const modal = closeButton.closest('.modal');
    closeModal(modal);
  }
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

function changeAvailability(id){
  let block = document.getElementById(id);
  
  if (block.classList.contains('reserved')) {
      // If red, change to original color
      block.classList.remove('reserved');
      block.style.backgroundColor = "";
  } else {
      // If not red, change to red
      block.classList.add('reserved');
      block.style.backgroundColor = "rgba(230, 38, 38, 0.865)";
  }
}

