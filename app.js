/*=================================================================
app.js is part of the Employee Web Directory

This program fetches employee information from a server and then
displays it on index.html, with the option of displaying more 
information in a popup window.
==================================================================*/

// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location,
phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".wrapper");
const card = document.querySelector(".card");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");





/*================================
fetch info from API
translate into json
store info in variable results
stick it in displayEmployees
================================*/
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

/*====================================================================
displayEmployees function takes the data from the API and sticks it 
on the page
=====================================================================*/

function displayEmployees(employeeData){
    let employeeHTML = "";
    employees = employeeData;

    //create some HTML based on employee info
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
            <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            </div>
            </div>
`
        });

gridContainer.innerHTML = employeeHTML;

};

/*======================================================
Overlay - Modal Window
Displays more info about each employee, 
inserts into card-col div
=======================================================*/

function displayModal(index) {
    /* use object destructuring make our template literal cleaner */
    let {
      name,
      dob,
      phone,
      email,
      location: { street, city, state, postcode },
      picture,
    } = employees[index];
  
    let date = new Date(dob.date);
  
    const modalHTML = `
         <button class="previous round" id="previous">&#8249;</button>
         <img class="avatar" src="${picture.large}" />
         <button class="next round" id="next">&#8250</button>
         <div class="card-col">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr>
            <p>${phone}</p>
            <p class="address">${street.number} ${street.name} ${city} ${state} ${postcode}</p>
        
            <p>Birthday:
            ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
          </div>
        `;
  
  
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;

// Event Listener: Arrows in popup to switch employees
let previousButton = document.getElementById('previous');
let nextButton = document.getElementById('next');

previousButton.addEventListener("click", e => {
    if(e.target === previousButton) {
      if(index === 0) {
        displayModal(11); 
      } else {
        displayModal(index -1);
      }
    }
  });

nextButton.addEventListener("click", e => {
    if(e.target === nextButton) {
      if(index === 11) {
        displayModal(0); 
        index=0;
      } else {
        displayModal(index +1);
      }
    }
  });
}

/*=================================================================
Independent Event Listeners
1. gridContainer click on the card to open the popup with more info
2. Click the X in the overlay to close the popup

==================================================================*/

// 1. Open popup window
gridContainer.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element
    
    const card = e.target.closest(".card");
    
    index = parseInt(card.getAttribute('data-index'));
    displayModal(index);
    }
    });

// 2. X to close
modalClose.addEventListener('click', () => {
    overlay.classList.add("hidden");
    });


/*======================================
Filter Search Bar
Create an array of card items and names,
Look through cardArray and see if searchTerm matches employee name,
If there is a match, display it,
Otherwise, don't!

Run the program
search.addEventListener('keyup', filterEmployee);

Clicking the X in the search bar makes the original array display again
search.addEventListener('search', filterEmployee);

======================================*/

const search = document.querySelector("#search");

let filterEmployee = (event) => {

  // get an array of card items and names
  const cardArray = document.querySelectorAll(".card .name");
  // the event of typing becomes the searchTerm
  // translating to lowercase makes it easier to match terms
  const searchTerm = event.target.value.toLowerCase();
  /*
  Look through cardArray. If the searchTerm matches the name of an 
  employee (name), then display the employee card.
  If it doesn't match, then don't show it.
  This way only matches show up on the screen. 
  */
  cardArray.forEach((employeeCard) => {
      // name needs to be lowercase to match searchTerm
      let name = employeeCard.textContent.toLowerCase();
      // name is nested inside card-col nested inside card, so call parentElement twice
      let employee = employeeCard.parentElement.parentElement;
      
      /* syntax of includes() for future reference
      arr.includes(valueToFind[, fromIndex])
      */

      if (name.includes(searchTerm)) {
        employee.style.display = "";
      } else {
        employee.style.display = "none";
      }

  }
  );

}

search.addEventListener('keyup', filterEmployee);
search.addEventListener('search', filterEmployee);
