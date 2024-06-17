async function downloadCarsAll() {
    const db = firebase.firestore();
    const ref = db.collection('cars');

    let cars = [];
    await ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const car = new Car(
                data.price,
                data.id,
                data.brand,
                data.model,
                data.includedKmDay,
                data.oneExtraKmPrice,
                data.deposit,
                data.urlImage,
                data.urlImages,
                data.desc,
                data.services.map(serviceData => new CarService(
                    serviceData.name,
                    serviceData.price,
                    serviceData.isAvailable,
                    serviceData.isAdd
                )),
                data.startDate,
                data.endDate,
                data.color,
                data.hp,
                data.numPeople,
                data.suitcases,
                data.isSportCar,
                data.topSpeed,
                data.timeToHundred,
				data.isManual
            );

            cars.push(car);
        });
    }).catch((error) => {
        console.log("Error getting data: ", error);
    });

	// Filter price car ----------------------------
    let carPrices = cars.map(function(car) {
        return car.price;
    });
	minPriceCar = Math.min(...carPrices);
    maxPriceCar = Math.max(...carPrices);

	// Set brand filter to buttons
	const dropdownMenuBrand = document.getElementById('carBrandDropdown');
	dropdownMenuBrand.innerHTML = '';

	let carBrands = cars.map(car => car.brand).filter((brand, index, self) => self.indexOf(brand) === index).sort();

	// Al brand
	const bElement = document.createElement('button');
	bElement.id = 'filterButtonBrandIdCar-all';
	bElement.textContent = 'All brands';
	bElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
	bElement.onclick = function() {
		filterCarsByBrand('all');
	};
	bElement.value = 'false';
	dropdownMenuBrand.appendChild(bElement);

	// Specific brand
	carBrands.forEach(brand => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonBrandIdCar-' + brand;
		aElement.textContent = brand;
		aElement.classList.add('btn', 'dropdown-item', 'btn-dropdown');
		aElement.onclick = function() {
			filterCarsByBrand(brand);
		};
		aElement.value = 'false';
	
		dropdownMenuBrand.appendChild(aElement);
	});

	// Set color filter to buttons
	const dropdownMenuColor = document.getElementById('carColorDropdown');
	dropdownMenuColor.innerHTML = '';

	let carColors = cars.map(car => car.color === 'gray' ? 'grey' : car.color)
                    	.filter((color, index, self) => self.indexOf(color) === index);

	carColors.forEach(color => {
		const aElement = document.createElement('button');
		aElement.id = 'filterButtonColorIdCar-' + color;
		aElement.classList.add('btn', 'dropdown-item');
		aElement.style.backgroundColor = color;
		aElement.style.borderRadius = '0%';
		aElement.style.width = '150px';
		aElement.style.height = '15px';
		aElement.style.marginBottom = '5px';
		aElement.style.border = '1px solid grey';
		aElement.onclick = function() {
			filterCarsByColor(color);
		};
		aElement.value = 'false';
	
		dropdownMenuColor.appendChild(aElement);
	});

	// Set price filter to buttons
	const dropdownMenuPrice = document.getElementById('carPriceDropdown');
	dropdownMenuPrice.innerHTML = '';

	const sliderElement = document.createElement('div');
	sliderElement.id = 'filterButtonPriceIdCar';

	dropdownMenuPrice.appendChild(sliderElement);

	const priceSlider = noUiSlider.create(sliderElement, {
		start: [maxPriceCar/4, maxPriceCar/2],
		step: 10,
		tooltips: [
			wNumb({decimals: 0}),
			wNumb({decimals: 0})
		],
		range: {
			'min': minPriceCar,
			'max': maxPriceCar
		}
	});

	priceSlider.on('change', handleSliderChangeCar);

    return cars;
}