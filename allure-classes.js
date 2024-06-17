//*** Classes
class Services {
    constructor(price) {this._price = parseFloat(price);}
    get price() {return this._price;}
    set price(price) {this._price = parseFloat(price);}
}
class CarService extends Services {
    constructor(name, price, isAvailable, isAdd) {
        super(price);
        this._name = name;
        this._isAvailable = isAvailable;
        this._isAdd = isAdd;
    }
    get name() {return this._name;}
    get isAvailable() {return this._isAvailable;}
    get isAdd() {return this._isAdd;}
    set isAdd(isAdd) {this._isAdd = isAdd;}
}
class Car extends Services {
    constructor(price = 0, id = 0, brand = '', model = '', includedKmDay = 0, oneExtraKmPrice = 0, deposit = 0, urlImage = '', urlImages = [], desc = '', services = [], startDate = '', endDate = '',
		color = '', hp = 0, numPeople = 0, suitcases = 0, isSportCar = false, topSpeed = 0, timeToHundred = 0, isManual = false) {
        super(price);
        this._id = id;
        this._brand = brand;
        this._model = model;
        this._includedKmDay = includedKmDay;
        this._oneExtraKmPrice = oneExtraKmPrice;
        this._deposit = deposit;
        this._urlImage = urlImage;
        this._urlImages = urlImages;
        this._desc = desc;
        this._services = services;
        this._startDate = startDate;
        this._endDate = endDate;
        this._color = color;
        this._hp = hp;
		this._numPeople = numPeople;
		this._suitcases = suitcases;
		this._isSportCar = isSportCar;
		this._topSpeed = topSpeed;
		this._timeToHundred = timeToHundred;
		this._isManual = isManual;
    }
    // Getters
    get id() {return this._id;}
    get brand() {return this._brand;}
    get model() {return this._model;}
    get includedKmDay() {return this._includedKmDay;}
    get oneExtraKmPrice() {return this._oneExtraKmPrice;}
    get deposit() {return this._deposit;}
    get urlImage() {return this._urlImage;}
    get urlImages() {return this._urlImages;}
    get desc() {return this._desc;}
    get services() {return this._services;}
    get startDate() {return this._startDate;}
    get endDate() {return this._endDate;}
    get color() {return this._color;}
    get hp() {return this._hp;}
	get numPeople() {return this._numPeople;}
	get suitcases() {return this._suitcases;}
	get isSportCar() {return this._isSportCar;}
	get topSpeed() {return this._topSpeed;}
	get timeToHundred() {return this._timeToHundred;}
	get isManual() {return this._isManual;}
    // Setters
    set id(newId) {this._id = newId;}
    set brand(newBrand) {this._brand = newBrand;}
    set model(newModel) {this._model = newModel;}
    set includedKmDay(newIncludedKmDay) {this._includedKmDay = newIncludedKmDay;}
    set oneExtraKmPrice(newOneExtraKmPrice) {this._oneExtraKmPrice = newOneExtraKmPrice;}
    set deposit(newDeposit) {this._deposit = newDeposit;}
    set urlImage(newUrlImage) {this._urlImage = newUrlImage;}
    set urlImages(newUrlImages) {this._urlImages = newUrlImages;}
    set desc(newDesc) {this._desc = newDesc;}
    set services(newServices) {this._services = newServices;}
    set startDate(startDate) {this._startDate = startDate;}
    set endDate(endDate) {this._endDate = endDate;}
    set color(newColor) {this._color = newColor;}
    set hp(newHp) {this._hp = newHp;}
}