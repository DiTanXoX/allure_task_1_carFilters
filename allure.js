/* Page preparation */	//**************************************************
var isLocal = true;

// constants
const SERVICE_APARTMENT = 0;
const SERVICE_CAR = 1;
const SERVICE_YACHT = 2;
const SERVICE_PLANE = 3;

// general
var numColumns = 1;

// pages
var totalCars = 0;
var carsPerPage = 12;
var totalPagesCar = 0;
var lastDoc = null;
var lastPage = 0;

var maxPriceApartment;
var minPriceApartment;
var maxPriceCar;
var minPriceCar;
var maxPriceYacht;
var minPriceYacht;
var maxPricePlane;
var minPricePlane;

// services
var apartments = [];
var cars = [];
var yachts = [];
var planes = [];

// current
var currMinPriceApt = -1;
var currMinPriceCar = -1;
var currMinPriceYach = -1;
var currMinPricePla = -1;

let currCarBrand = 'all';
let currCarModel = 'all';
let currCarColor = 'all';
let currCarPrive = [0, Infinity];

var currPageCar = 1;
var currService = 0;

// cart
var isCartOpen = false;
var totalAmountCart = 0;
var serviceInCart = 0;
var newOrderName = '';
var apartmentsInCart = [];
var carsInCart = [];
var yachtsInCart = [];
var planesInCart = [];

// filters
var citySelected = '';
var pplSelected = 0;
var stDateSelected = '';
var enDateSelected = '';
var filteredCars = '';

/* Set visible first service */	//**************************************************
// Reset all <div id="mainColumnX" class="serviceDiv col-12"> to invisible
var divs = document.getElementsByClassName('serviceDiv');
for (let i = 0; i < divs.length; i++) {
    divs[i].style.display = 'none';
}
// Set actual -> first service = apartments to visibleº
document.getElementById('mainColumn1').style.display = 'block';
// Same with filters <div id="filterX" class="serviceDiv">
document.getElementById('filter1').style.display = 'block';

//*** FireBase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0f07_UVK0Q5SrMZw6M6vGrHvG3yI30iQ",
    authDomain: "allure-premium-service-a4a9d.firebaseapp.com",
    projectId: "allure-premium-service-a4a9d",
    storageBucket: "allure-premium-service-a4a9d.appspot.com",
    messagingSenderId: "122912019501",
    appId: "1:122912019501:web:ebf41e44668ca038e854a4",
    measurementId: "G-JFKF4BW6V3"
};
firebase.initializeApp(firebaseConfig);

/* PRELOAD */	//**************************************************

if (window.innerWidth < 1024) {
	numColumns = 1;
} else if (window.innerWidth < 1440) {
	numColumns = 2;
} else if (window.innerWidth < 1920) {
	numColumns = 3;
} else {
	numColumns = 4;
}

// JIEOWG78907EWOPGWEIOUGJ
addColumnsToRow('apt');
addColumnsToRow('car');
addColumnsToRow('yac');
addColumnsToRow('pla');

/* DOM */ //**************************************************
// document.addEventListener('DOMContentLoaded', async function() {
// 	// Cart	*****************************************
// 	document.getElementById('totalRow').style.display = 'none';
// 	document.getElementById('cartBadge').style.display = 'none';

//     // Add buttons with pages to cars	*****************************************
//     totalCars = await getCountDocs("car");
// 	addPageButtonsCars(totalCars);

// 	// Data from main page	*****************************************
// 	// City
// 	setCitiesDropdown();
// 	// People
// 	setPeopleDropdown();

// 	// Calendar	*****************************************
// 	setCalendarFilter();
// });

/* ON LOAD ONLOAD */ //**************************************************
// Show service	based on URL
window.onload = async function() {//city=&ppl=0&start_date=&end_date=
	const preloadService = new URLSearchParams(window.location.search).get('preloadService');
	const preloadCity = new URLSearchParams(window.location.search).get('city');
	const preloadPpl = new URLSearchParams(window.location.search).get('ppl');
	const preloadStDate = new URLSearchParams(window.location.search).get('start_date');
	const preloadEnDate = new URLSearchParams(window.location.search).get('end_date');
    console.log('Recieved: ' + preloadService);    // String
    //console.log(typeof preloadService)

	if (preloadService == null) {
		setDefaultURL();
		preloadService = '0';
	}

	if (preloadCity != null) {
		switchCity(preloadCity);
		citySelected = preloadCity;
	}
	if (preloadPpl != null) {
		switchPeople(parseInt(preloadPpl));
		pplSelected = parseInt(preloadPpl);
	}
	if (preloadStDate != null || preloadEnDate != null) {
		changeCalendarDates(preloadStDate, preloadEnDate)
	}
	if (preloadStDate != null) {
		stDateSelected = preloadStDate;
	}
	if (preloadEnDate != null) {
		enDateSelected = preloadEnDate;
	}
	
	if (preloadService === '0') {
		currService = 0;
		showDiv('mainColumn1', 'filter1')
	} else if (preloadService === '1') {
		currService = 1;
		showDiv('mainColumn2', 'filter2')
	} else if (preloadService === '2') {
		currService = 2;
		showDiv('mainColumn3', 'filter3')
	} else if (preloadService === '3') {
		currService = 3;
		showDiv('mainColumn4', 'filter4')
	}
}

/* Methods general */ //**************************************************

function createServicesCar() {
    let serviceA = new CarService("Cleaning", 20, true, false);	
    let serviceB = new CarService("Transfer", 30, true, false);
    let serviceC = new CarService("Driver", 15, true, false);
    return [serviceA, serviceB, serviceC];
}

function createCardCar(car) {
	let titleText = car.brand + ' ' + car.model;
	let fontSize = '';
	if (titleText.length > 36) {
		fontSize = '13px';
	} else if (titleText.length > 26) {
		fontSize = '14px';
	} else if (titleText.length > 16) {
		fontSize = '15px';
	} else {
		fontSize = '16px';
	}
	titleText = `<h5 class="bold-centered" style="font-size: ${fontSize}">${car.brand + " " + car.model}</h5>`;

    let cardBodyContent;
    if (car.isSportCar) {
        cardBodyContent = `
            <div class="row-title position-relative">
                <div class="col-12">
                    <!--<h5 class="bold-centered" style="font-size: 12px;">${car.brand + " " + car.model}</h5>-->
					${titleText}
                </div>
            </div>
            <div class="row-centered">
				<div class="col-1"></div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/metro/26/engine.png" style="padding-bottom: 2px;" alt="engine"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 13px; padding-top: 3px;">${car.hp}HP</h5>
                        </div>
                    </div>
                </div>
                <div class="col column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/ios-filled/50/speed.png" alt="speed"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 13px; padding-top: 3px;">${car.topSpeed}km/h</h5>
                        </div>
                    </div>
                </div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/fluency-systems-filled/48/lightning-bolt.png" alt="lightning-bolt"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="white-space: nowrap; font-size: 13px; padding-top: 3px;">0-100:${car.timeToHundred}s</h5>
                        </div>
                    </div>
                </div>
				<div class="col-1"></div>
            </div>
        `;
    } else {
		let changeText = '';
		if (car.isManual) {
			changeText = 'Manual';
		} else {
			changeText = 'Auto';
		}
        cardBodyContent = `
            <div class="row-title position-relative">
                <div class="col-12">
                    <!--<h5 class="bold-centered" style="font-size: 12px">${car.brand + " " + car.model}</h5>-->
					${titleText}
                </div>
            </div>
            <div class="row-centered">
				<div class="col-1"></div>
                <div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/forma-regular-filled/24/user.png" alt="user"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 15px; padding-top: 2px;">${car.numPeople}</h5>
                        </div>
                    </div>
                </div>
                <div class="col column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/pastel-glyph/64/1A1A1A/suitcase--v3.png" style="padding-bottom: 0.2em; line-height: 0.4em;" alt="suitcase--v3"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 15px; padding-top: 4px;">${car.suitcases}</h5>
                        </div>
                    </div>
                </div>
				<div class="col-3 column-car-body">
                    <div class="row row-level1">
                        <div class="col col-level1">
                            <img width="25" height="25" src="https://img.icons8.com/external-outline-design-circle/66/external-Car-Gear-car-parts-outline-design-circle.png" style="padding-bottom: 0.2em; line-height: 0.4em;" alt="external-Car-Gear-car-parts-outline-design-circle"/>
                        </div>
                        <div class="col col-level1">
                            <h5 style="font-size: 14px; padding-top: 4px;">${changeText}</h5>
                        </div>
                    </div>
                </div>
				<div class="col-1"></div>
            </div>
        `;
    }
    return `
        <div class="col-12 col-serv-pre-card">
            <div class="mb-3 service-card" carId="${car.id}">
                <img class="card-car-img-top" src="${car.urlImage}" onclick="openServiceModal(${car.id}, 1)" alt="Car card image">
                <div class="card-car-body" onclick="openServiceModal(${car.id}, 1)">
                    ${cardBodyContent}
                </div>
                <div class="row row-card-reserve-button">
					<div class="col-12">
						<button id="add-${car.id}" class="card-service-reserve-button center-button-in-row12" onclick="openServiceModal(${car.id}, 1)">
							<span class="transition"></span>
							<span class="gradient"></span>
							<span class="label">Reserve</span>
						</button>
					</div>
                </div>
            </div>
            <div class="badge-outer">${car.price} €/day</div>
        </div>
    `;
}

// -----------------------1-----------------------
function switchCarByColor(carId) {
    let car = cars.find(car => car.id === carId);
    if (!car) {
      console.error(`There is not car with ID ${carId}`);
      return;
    }
    
    // Images
    const carousel = document.getElementById("carouselCarIndicators");
    const carouselInner = carousel.querySelector(".carousel-inner");
    const carouselIndicators = carousel.querySelector(".carousel-indicators");
    carouselInner.innerHTML = "";
    carouselIndicators.innerHTML = "";
    car.urlImages.forEach((url, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) {
            carouselItem.classList.add("active");
        }
      
        const img = document.createElement("img");
        img.classList.add("d-block", "w-100");
        img.src = url;
        img.alt = `Slide ${index + 1}`;
      
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
      
        const indicator = document.createElement("li");
        indicator.dataTarget = "#carouselCarIndicators";
        indicator.dataset.slideTo = index;
        if (index === 0) {
            indicator.classList.add("active");
        }
        carouselIndicators.appendChild(indicator);
    });
    $(carousel).carousel();

    document.getElementById("modalCarPriceTextP").textContent = `${car.price} € / Day`;
    document.getElementById("modalCarDescTextP").innerHTML = `${car.desc.replace(/\n/g, '<br>')}`;
}

function setDefaultURL() {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('preloadService', '0');
    window.history.replaceState({}, '', currentUrl);
}

/**
 * Add page buttons in car page.
 * @param {number} totalPagesCar Total count of pages.
 * @param {number} totalCars Total count of cars.
 */
function addPageButtonsCars(totalCars) {
	totalPagesCar = Math.ceil(totalCars/carsPerPage);
	let paginationContainer = document.querySelector('.pagination-cars');

	// Botón de Anterior
	let previousPageItem = document.createElement('li');
	previousPageItem.className = 'page-item';

	let previousPageLink = document.createElement('a');
	previousPageLink.className = 'page-link';
	previousPageLink.setAttribute('aria-label', 'Previous');
	previousPageLink.innerHTML = '<span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span>';
	previousPageLink.style.color = 'black';
	previousPageLink.addEventListener('click', function(event) {
		event.preventDefault();
		displayCarsPageNextPrev('prev');
	});
	previousPageItem.appendChild(previousPageLink);
	paginationContainer.appendChild(previousPageItem);

	// Generate buttons
	for (let i = 1; i <= totalPagesCar; i++) {
		let pageItem = document.createElement('li');
		pageItem.className = 'page-item';

		let pageButton = document.createElement('a');
		pageButton.className = 'page-link';
		pageButton.textContent = i;
		pageButton.style.color = 'black';

		if (i === currPageCar) {
			pageButton.classList.add('current-page');
		}

		pageButton.addEventListener('click', function(event) {
			event.preventDefault();

			let allButtons = document.querySelectorAll('.pagination-cars .page-item .page-link');
			allButtons.forEach(function(button) {
				button.classList.remove('current-page');
			});

			this.classList.add('current-page');

			displayCarsPage(parseInt(this.textContent));
			currPageCar = parseInt(this.textContent);

		});

		pageItem.appendChild(pageButton);
		paginationContainer.appendChild(pageItem);
	}

	// Botón de Siguiente
	let nextPageItem = document.createElement('li');
	nextPageItem.className = 'page-item';

	let nextPageLink = document.createElement('a');
	nextPageLink.className = 'page-link';
	nextPageLink.setAttribute('aria-label', 'Next');
	nextPageLink.innerHTML = '<span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span>';
	nextPageLink.style.color = 'black';
	nextPageLink.addEventListener('click', function(event) {
		event.preventDefault();
		displayCarsPageNextPrev('next');
	});
	nextPageItem.appendChild(nextPageLink);
	paginationContainer.appendChild(nextPageItem);
}

/**
 * Get total count of documents in Data Base.
 * @param {string} docName apt, car, yac, pla
 * @returns {Promise<number>} The total count of documents.
 */
async function getCountDocs(docName) {
    const db = firebase.firestore();
    let docRef;
    if (docName == "apt") {
        docRef = db.collection('totalDocs').doc('countApartments');
    } else if (docName == "car") {
        docRef = db.collection('totalDocs').doc('countCars');
    } else if (docName == "yac") {
        docRef = db.collection('totalDocs').doc('countYachts');
    } else if (docName == "pla") {
        docRef = db.collection('totalDocs').doc('countPlanes');
    }

    try {
        const doc = await docRef.get();
        if (doc.exists) {
            return doc.data().total;
        } else {
            console.log("Error getting total count of documents");
            return 0;
        }
    } catch (error) {
        console.log("Error getting document: ", error);
        return 0;
    }
}

function addCardCar(car, column) {
    let cardHTML = createCardCar(car);
    column.innerHTML += cardHTML;
}


function filterCarsByBrand(brand) {
	currCarBrand = brand;
	applyFilters();

}


function applyFilters() {
    filteredCars = cars;
	const carModelDisabledOrAbled = document.getElementById('dropdownMenuButtonCarModel');
	carModelDisabledOrAbled.classList.add('disabled');

    if (currCarBrand !== 'all') {
        filteredCars = filteredCars.filter(car => car.brand === currCarBrand);
		carModelDisabledOrAbled.classList.remove('disabled');
    }

	if (currCarModel !== 'all') {
		filteredCars = filteredCars.filter(car => car.model === currCarModel);
	}

	if (currCarColor !== 'all') {
        filteredCars = filteredCars.filter(car => car.color === currCarColor);
    }

    filteredCars = filteredCars.filter(car => car.price >= currCarPrive[0] && car.price <= currCarPrive[1]);
    filteredCars.sort((a, b) => a.price - b.price);

    let carRow = document.getElementById('carRow');
    carRow.innerHTML = '';
    addColumnsToRow('car');

    let columns = document.getElementsByClassName('col-car');
    for (let i = 0; i < columns.length; i++) {
        columns[i].innerHTML = '';
    }

    addCardsToColumns('car', filteredCars, 0, false);
}

function switchCarByModel(model) {
	currCarModel = model;
	applyFilters();
}

function filterCarsByColor(color) {
	if (color === 'gray' || color === 'grey') {
		color = ['gray', 'grey'];
	}

	currCarColor = color;
	applyFilters();

}


function displayCarsPageNextPrev(direction) {
	let nextPage = 0;
	if (direction === 'prev') {
		if (currPageCar === 1) {
			nextPage = totalPagesCar;
			currPageCar = 7;
		} else {
			nextPage = currPageCar - 1;
			currPageCar = nextPage;
		}
	} else if (direction === 'next') {
		console.log(currPageCar);
		console.log(totalPagesCar);
		if (currPageCar === totalPagesCar) {
			nextPage = 1;
			currPageCar = 1;
		} else {
			nextPage = currPageCar + 1;
			currPageCar = nextPage;
		}
	}
	
	let allButtons = document.querySelectorAll('.pagination-cars .page-item .page-link');
	allButtons.forEach(function(button) {
		button.classList.remove('current-page');
	});

	let pageButtons = document.querySelectorAll('.pagination-buttons .pagination-cars .page-item:not(.prev):not(.next) .page-link:not([aria-label="Previous"]):not([aria-label="Next"])');

	pageButtons.forEach(function(button) {
		let pageNumber = parseInt(button.textContent.trim());

		if (pageNumber === nextPage) {
			button.classList.add('current-page');
		}
	});

	if (direction === 'prev') {
		displayCarsPage(nextPage);
	} else if (direction === 'next') {
		console.log(nextPage);
		displayCarsPage(nextPage);
	}
}

function displayCarsPage(pageNumber) {
	scrollToTop(200);

    let carRow = document.getElementById('carRow');
    carRow.innerHTML = '';

    addColumnsToRow('car');

    let columns = document.getElementsByClassName('col-car');
    for (let i = 0; i < columns.length; i++) {
        columns[i].innerHTML = '';
    }

    addCardsToColumns('car', cars, pageNumber, true)
}

function scrollToTop(duration) {
    const startingY = window.scrollY;
    const startTime = performance.now();

    function scrollStep(timestamp) {
        const timeElapsed = timestamp - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        window.scrollTo(0, startingY * (1 - progress));

        if (timeElapsed < duration) {
            window.requestAnimationFrame(scrollStep);
        }
    }

    window.requestAnimationFrame(scrollStep);
}

// -----------------------3-----------------------

/**
 * Price slider for cars.
 * @param {Array} values 
 */
function handleSliderChangeCar(values) {
	console.log("min: " + values[0] + " | max: " + values[1]);

	currCarPrive = values;
	applyFilters();
}

/**
 * Switch between services page.
 * @param {string} id mainColumnX (1-4)
 * @param {string} idService filterX (1-4)
 */
async function showDiv(id, idService) {
    let divs = document.getElementsByClassName('serviceDiv');
    for (let i = 0; i < divs.length; i++) {
        divs[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
    let divs2 = document.getElementsByClassName('filterDiv');
    for (let i = 0; i < divs2.length; i++) {
        divs2[i].style.display = 'none';
    }
    document.getElementById(idService).style.display = 'block';

    // Title of page and load data
    if (id == 'mainColumn1') {
		let countDocs = await getCountDocs("apt");
		if (apartments.length != countDocs) {
			console.log("Loading apartments...");
			apartments = [];
			apartments = await downloadApartmentsAll();
		} else {
			console.log("All apartments were previously loaded");
		}

		let columns = document.getElementsByClassName('col-apartment');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('apt', apartments, 0, false)

		// Change URL
		currService = 0;
		changeURL(currService)
	} else if (id == 'mainColumn2') {   // GGEWGWE24543ILHGUUB EGEWOIGEHWJ23875326832-1
        lastPage = 0;
        lastDoc = null;

        let countDocs = await getCountDocs("car");
        if (cars.length != countDocs) {
			cars = [];
            console.log("Loading all cars...");
            cars = await downloadCarsAll();
            // Sort cars by price low to high
            cars.sort((a, b) => a.price - b.price);
        } else {
            console.log("All cars were previously loaded");
        }
        displayCarsPage(1);

		// Change URL
		currService = 1;
		changeURL(currService)

		// Set last page
		displayCarsPage(currPageCar);
    } else if (id == 'mainColumn3') {
        let countDocs = await getCountDocs("yac");
        if (yachts.length != countDocs) {
            console.log("Loading yachts...");
            yachts = [];
            yachts = await downloadYachtsAll();
        } else {
            console.log("All yachts were previously loaded");
        }

		let columns = document.getElementsByClassName('col-yacht');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('yac', yachts, 0, false);

		// Change URL
		currService = 2;
		changeURL(currService)
    } else if (id == 'mainColumn4') {
        let countDocs = await getCountDocs("pla");
        if (planes.length != countDocs) {
            console.log("Loading planes...");
            planes = [];
            planes = await downloadPlanesAll();
        } else {
            console.log("All planes were previously loaded");
        }

		let columns = document.getElementsByClassName('col-plane');
		for (let i = 0; i < columns.length; i++) {
			columns[i].innerHTML = '';
		}

		addCardsToColumns('pla', planes, 0, false);

		// Change URL
		currService = 3;
		changeURL(currService)
    }
}