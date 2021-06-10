/*=================================================================
app.js is part of the Employee Web Directory

This program fetches employee information from a server and then
displays it on index.html, with the option of displaying more 
information in a popup window.
==================================================================*/

// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const modalClose = document.querySelector(".modal-close");
const gridContainer = document.querySelector(".wrapper");
const modalContainer = document.querySelector(".card");


/*
fetch info from API
translate into json
store info in variable results
stick it in displayEmployees
*/
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

/*
displayEmployees function takes the data from the API and sticks it 
on the page
*/

function displayEmployees(employeeData){
    let employeeHTML = "";

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


function displayModal(index) {
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
        <img class="avatar" src="${picture.large}" />
        <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street}, ${state} ${postcode}</p>
        <p>Birthday:
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
        `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
}