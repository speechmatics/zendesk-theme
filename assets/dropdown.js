const dropdownContainer = document.querySelector('.dropdown-container');
const dropdownContent = document.querySelector('.dropdown-content');

let hoverFlag = false; // To track if the dropdown is open due to hover

dropdownContainer.addEventListener('mouseenter', function () {
    dropdownContent.classList.add('open');
    dropdownContainer.setAttribute('aria-expanded', 'true');
    hoverFlag = true;
});

dropdownContainer.addEventListener('mouseleave', function () {
    if (! hoverFlag) {
        dropdownContent.classList.remove('open');
        dropdownContainer.setAttribute('aria-expanded', 'false');
    }
});

// Handle click to toggle dropdown
dropdownContainer.addEventListener('click', function (event) {
    if (dropdownContent.classList.contains('open')) {
        //dropdownContent.classList.remove('open');
        dropdownContainer.setAttribute('aria-expanded', 'false');
        hoverFlag = false;
    } else {
        dropdownContent.classList.add('open');
        dropdownContainer.setAttribute('aria-expanded', 'true');
        hoverFlag = true;
    } event.stopPropagation(); // Prevent clicks from closing the dropdown
});

// Close dropdown when moving the mouse away from the dropdown container
document.addEventListener('mousemove', function (event) {
    if (! dropdownContainer.contains(event.target)) {
        dropdownContent.classList.remove('open');
        dropdownContainer.setAttribute('aria-expanded', 'false');
        dropdownContent.setAttribute('aria-expanded', 'false')
        hoverFlag = false;
    }
});