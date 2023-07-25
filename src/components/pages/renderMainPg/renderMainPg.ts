import createHtmlElement from '../../../utils/createHtmlElement';
import api from '../../api/api';
import { ICarsResponse } from '../../interface/interface';
import renderCar from './renderCar';
import { mainHandler } from './mainHandler';
import renderWinner from '../renderResultsPg/renderResultsPg';

class RenderMainPg {
  private container: HTMLDivElement;

  public garageBtnState: boolean[];

  constructor(mainContainer: HTMLDivElement) {
    this.container = mainContainer;
    this.garageBtnState = [true, false];
  }

  drawHeader():void {
    const header = createHtmlElement('header', 'header');
    const garageBtn = <HTMLButtonElement>createHtmlElement('garage btn-dark', 'button', 'to garage');
    garageBtn.disabled = true;
    const resultsBtn = createHtmlElement('results btn-dark', 'button', 'to winners');
    header.append(garageBtn, resultsBtn);
    this.container.append(header);
    header.addEventListener('click', mainHandler.headerHandler.bind(mainHandler));
    this.drawMain();
  }

  async drawMain():Promise<void> {
    const garageContainer = createHtmlElement('garage-container');
    const controllerContainer = createHtmlElement('car-controller controller-container');
    for (let i = 0; i < 3; i += 1) {
      const controllerItem = createHtmlElement('conroller-item');
      if (i < 2) {
        const carNameInp = <HTMLInputElement>createHtmlElement(`${i === 1 ? 'car-name create-name' : 'car-name update-name'}`, 'input');
        carNameInp.setAttribute('type', 'text');
        const carColorInp = <HTMLInputElement>createHtmlElement(`${i === 1 ? 'car-color create-color' : 'car-color update-color'}`, 'input');
        carColorInp.setAttribute('type', 'color');
        const changeBtn = <HTMLButtonElement>createHtmlElement(`${i === 1 ? 'create-car' : 'update-car'} btn-light`, 'button', `${i === 1 ? 'create' : 'update'}`);
        if (i === 0) {
          carNameInp.disabled = true;
          carColorInp.disabled = true;
          changeBtn.disabled = true;
        }
        controllerItem.append(carNameInp, carColorInp, changeBtn);
      } else if (i === 2) {
        const raceBtn = createHtmlElement('race btn-dark', 'button', 'race');
        const resetBtn = <HTMLButtonElement>createHtmlElement('reset btn-dark', 'button', 'reset');
        resetBtn.disabled = true;
        const generateBtn = createHtmlElement('generate-cars btn-light', 'button', 'generate cars');
        controllerItem.append(raceBtn, resetBtn, generateBtn);
      }
      controllerContainer.append(controllerItem);
    }
    garageContainer.append(controllerContainer);
    const carsData = await api.getCars(mainHandler.currentGaragePage, 7);
    this.renderCartContainer(garageContainer as HTMLDivElement, carsData);
  }

  renderCartContainer(garageContainer: HTMLDivElement, carsData: ICarsResponse): void {
    const main = createHtmlElement('main', 'main');
    const garageTitle = createHtmlElement('garage-title', 'h1', `Garage (${carsData.totalCount})`);
    const pageCount = createHtmlElement('page-count', 'h3', `Page #${mainHandler.currentGaragePage}`);
    const cartContainer = createHtmlElement('car-container');
    garageContainer.append(garageTitle, pageCount, cartContainer);
    main.append(garageContainer);
    main.append(renderWinner.renderWinnerPg());
    this.container.append(main);
    main.addEventListener('click', mainHandler.mainHandler.bind(mainHandler));
    this.addCars();
    this.drawFooter();
  }

  public async addCars() {
    const carContainer = <HTMLDivElement>document.querySelector('.car-container');
    const carsData = await api.getCars(mainHandler.currentGaragePage, 7);
    carContainer.innerHTML = '';
    mainHandler.totalGarageCar = carsData.totalCount;
    const garageTitle = <HTMLElement>document.querySelector('.garage-title');
    garageTitle.textContent = `Garage (${mainHandler.totalGarageCar})`;
    carsData.cars.forEach((car) => {
      const containerItem = createHtmlElement('car-container__item');
      containerItem.setAttribute('id', `${car.id}`);
      const carSettings = createHtmlElement('car-settings');
      const selectBtn = createHtmlElement('select-btn btn-light', 'button', 'select');
      const removeBtn = createHtmlElement('remove-btn btn-light', 'button', 'remove');
      const carName = createHtmlElement('car-name', 'h4', car.name);
      carSettings.append(selectBtn, removeBtn, carName);
      const gameContainer = createHtmlElement('game-container');
      const carControl = createHtmlElement('car-control');
      const btnA = createHtmlElement('control-btn btn-a', 'button', 'A');
      const btnB = <HTMLButtonElement>createHtmlElement('control-btn btn-b', 'button', 'B');
      btnB.disabled = true;
      carControl.append(btnA, btnB);
      const carIcon = createHtmlElement('car-icon');
      carIcon.innerHTML = renderCar(car.color);
      const finishIcon = createHtmlElement('finish-icon');
      gameContainer.append(carControl, carIcon, finishIcon);
      containerItem.append(carSettings, gameContainer);
      carContainer.append(containerItem);
    });
  }

  private drawFooter(): void {
    const footer = createHtmlElement('footer', 'footer');
    const prevBtn = <HTMLButtonElement>createHtmlElement('prev btn-dark', 'button', 'prev');
    prevBtn.disabled = true;
    const nextBtn = createHtmlElement('next btn-dark', 'button', 'next');
    footer.append(prevBtn, nextBtn);
    const popup = createHtmlElement('popup', 'h2');
    this.container.append(footer, popup);
    footer.addEventListener('click', mainHandler.footerHandler.bind(mainHandler));
  }

  public drawPopUp(winner: string): void {
    const getPopUp = <HTMLElement>document.querySelector('.popup');
    getPopUp.textContent = winner;
    getPopUp.classList.add('active');
    setTimeout(() => {
      getPopUp.classList.remove('active');
    }, 8000);
  }

  renderPage():void {
    this.drawHeader();
  }
}

document.body.innerHTML = '';
document.body.append(createHtmlElement('container'));
const container = <HTMLDivElement>document.querySelector('.container');

const render = new RenderMainPg(container);

export default render;
