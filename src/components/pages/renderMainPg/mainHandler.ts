import api from '../../api/api';
import driveMode from '../../driveMode/driveMode';
import generate from '../../generateCar/generateCar';
import renderWinner from '../renderResultsPg/renderResultsPg';
import render from './renderMainPg';

type ActionType = 'add' | 'remove' | 'toggle';

const toggle = (elArr: string[], action: ActionType): void => {
  elArr.forEach((el) => {
    const getEl = document.querySelector(`.${el}`) as HTMLButtonElement | HTMLInputElement;
    switch (action) {
      case 'add':
        getEl.disabled = true;
        break;
      case 'remove':
        getEl.disabled = false;
        break;
      case 'toggle':
        getEl.disabled = !getEl.disabled;
        break;
      default:
        break;
    }
  });
};

class MainHandler {
  public currentCar: number;

  public currentGaragePage: number;

  public currentWinnerPage: number;

  public totalGarageCar: number;

  public totalWinnerCar: number;

  private textInp: NodeList | null;

  private colorInp: NodeList | null;

  public activePage: 'garage' | 'winners';

  constructor() {
    this.currentCar = -1;
    this.currentGaragePage = 1;
    this.currentWinnerPage = 1;
    this.totalWinnerCar = 0;
    this.totalGarageCar = 0;
    this.textInp = null;
    this.colorInp = null;
    this.activePage = 'garage';
  }

  public headerHandler(event: Event): void {
    const { classList } = <HTMLElement>event.target;
    if (classList.contains('garage')) {
      toggle(['garage', 'results'], 'toggle');
      this.activePage = 'garage';
      this.switchGarage();
    } else if (classList.contains('results')) {
      toggle(['garage', 'results'], 'toggle');
      this.activePage = 'winners';
      this.switchWinner();
    }
  }

  public async mainHandler(event: Event): Promise<void> {
    const target = <HTMLElement>event.target;
    this.textInp = <NodeList>document.querySelectorAll('.car-name');
    this.colorInp = <NodeList>document.querySelectorAll('.car-color');
    if (target.classList.contains('create-car') || target.classList.contains('update-car')) {
      if (target.classList.contains('update-car') && this.currentCar >= 0) {
        await this.updateCar();
      } else if (target.classList.contains('create-car')) {
        await this.createCar();
      }
      render.addCars();
    } else if (target.classList.contains('race')) {
      await this.startRace();
    } else if (target.classList.contains('reset')) {
      await this.resetRace();
    } else if (target.classList.contains('generate-cars')) {
      await this.generateCars();
    }
    this.carControlBtnHandler(target);
  }

  private async updateCar(): Promise<void> {
    if (this.currentCar >= 0 && this.textInp && this.textInp[0]
      && this.colorInp && this.colorInp[0]) {
      const updatedCarName = (<HTMLInputElement> this.textInp[0]).value;
      const updatedCarColor = (<HTMLInputElement> this.colorInp[0]).value;
      await api.updateCar(this.currentCar, updatedCarName, updatedCarColor);
      this.currentCar = -1;
      toggle(['update-name', 'update-color', 'update-car'], 'add');
      this.resetInputs([this.textInp[0], this.colorInp[0]] as HTMLInputElement[]);
    }
  }

  private async createCar(): Promise<void> {
    if (this.textInp && this.textInp[1] && this.colorInp && this.colorInp[1]) {
      const newCarName = (<HTMLInputElement> this.textInp[1]).value;
      const newCarColor = (<HTMLInputElement> this.colorInp[1]).value;
      await api.createCar(newCarName, newCarColor);
      this.resetInputs([this.textInp[1], this.colorInp[1]] as HTMLInputElement[]);
    }
  }

  private async startRace(): Promise<void> {
    driveMode.status = 'race';
    const allCarItems = document.querySelectorAll('.car-container__item');
    toggle(['create-name', 'create-color', 'update-car', 'update-name', 'update-color', 'create-car', 'generate-cars', 'race'], 'add');
    if (this.textInp && this.textInp[1] && this.colorInp && this.colorInp[1]) {
      this.resetInputs([this.textInp[0], this.colorInp[0]] as HTMLInputElement[]);
    }
    allCarItems.forEach(async (carItem: Element) => {
      const carIcon = <HTMLDivElement>carItem.querySelector('.car-icon');
      (<HTMLInputElement>carItem.querySelector('.btn-a')).disabled = true;
      (<HTMLInputElement>carItem.querySelector('.btn-b')).disabled = false;
      const carId = Number(carItem.id);
      const started = await api.startOrStopEngine(carId, 'started');
      const time = started.distance / (started.velocity * 7);
      driveMode.driveCar(carIcon, time, carId, started.velocity);
      const success = await api.switchEngineToDriveMode(carId);
      if (!success.success) {
        driveMode.stopCar(carId);
      }
    });
  }

  private async resetRace(): Promise<void> {
    const carArr:HTMLDivElement[] = Array.from(document.querySelectorAll('.car-icon'));
    driveMode.resetCars(carArr);
    const btnACollection = document.querySelectorAll('.btn-a') as NodeListOf<HTMLButtonElement>;
    const btnBCollection = document.querySelectorAll('.btn-b') as NodeListOf<HTMLButtonElement>;
    btnACollection.forEach((btnA, i) => {
      btnA.disabled = false;
      btnBCollection[i].disabled = true;
    });
    driveMode.stopAllCars();
    toggle(['create-name', 'create-color', 'reset', 'create-car', 'generate-cars', 'race'], 'toggle');
  }

  private async generateCars(): Promise<void> {
    await generate();
    render.addCars();
  }

  private async carControlBtnHandler(target: HTMLElement): Promise<void> {
    const clickedCar = <HTMLDivElement>target.closest('.car-container__item');
    if (target.classList.contains('select-btn') && driveMode.status === null) {
      this.currentCar = Number(clickedCar.id);
      const carData = await api.getCar(this.currentCar);
      toggle(['update-name', 'update-color', 'update-car'], 'remove');
      (<HTMLInputElement>document.querySelectorAll('.car-name')[0]).value = carData.name;
      (<HTMLInputElement>document.querySelectorAll('.car-color')[0]).value = carData.color;
    } else if (target.classList.contains('remove-btn') && driveMode.status === null) {
      await api.deleteCar(Number(clickedCar.id));
      await api.deleteWinner(Number(clickedCar.id));
      render.addCars();
      if (this.textInp && this.colorInp) {
        this.resetInputs([this.textInp[0], this.colorInp[0]] as HTMLInputElement[]);
      }
      toggle(['update-name', 'update-color', 'update-car'], 'add');
      this.currentCar = -1;
    } else if (target.classList.contains('btn-a') || target.classList.contains('btn-b')) {
      if (target.classList.contains('btn-a')) {
        const carIcon = <HTMLDivElement>clickedCar.querySelector('.car-icon');
        if (driveMode.status !== 'race') driveMode.status = 'drive';
        toggle(['create-name', 'create-color', 'update-car', 'update-name', 'update-color', 'create-car', 'generate-cars', 'race'], 'add');
        if (this.textInp && this.colorInp) {
          this.resetInputs([this.textInp[0], this.colorInp[0]] as HTMLInputElement[]);
        }
        driveMode.resetCars([carIcon]);
        const started = await api.startOrStopEngine((Number(clickedCar.id)), 'started');
        driveMode
          .driveCar(carIcon, started.distance / (started.velocity * 7), Number(clickedCar.id));
        const succes = await api.switchEngineToDriveMode(Number(clickedCar.id));
        if (succes.success === false) driveMode.stopCar(Number(clickedCar.id));
      } else if (target.classList.contains('btn-b')) {
        await driveMode.stopCar(Number(clickedCar.id));
        driveMode.resetCars([clickedCar.querySelector('.car-icon')] as HTMLDivElement[]);
      }
    }
  }

  public footerHandler(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.activePage === 'garage') {
      this.garageBtn(target);
    } else if (this.activePage === 'winners') {
      this.winnerBtn(target);
    }
  }

  private garageBtn(target: HTMLElement): void {
    if (driveMode.status === null && (target.classList.contains('prev') || target.classList.contains('next'))) {
      if (target.classList.contains('prev') && this.currentGaragePage > 1) {
        this.currentGaragePage -= 1;
        if (this.currentGaragePage === 1) {
          toggle(['prev'], 'add');
          render.garageBtnState[0] = true;
        } else {
          toggle(['next', 'prev'], 'remove');
          render.garageBtnState = [false, false];
        }
      } else if (target.classList.contains('next') && this.totalGarageCar / (this.currentGaragePage * 7) > 1) {
        this.currentGaragePage += 1;
        if (this.currentGaragePage === Math.ceil(this.totalGarageCar / 7)) {
          toggle(['next'], 'add');
          render.garageBtnState[1] = true;
        } else {
          toggle(['next', 'prev'], 'remove');
          render.garageBtnState = [false, false];
        }
      }
      driveMode.stopAllCars();
      toggle(['create-name', 'create-color', 'create-car', 'generate-cars', 'race'], 'remove');
      toggle(['reset'], 'add');
      const pageCount = <HTMLDivElement>document.querySelector('.page-count');
      pageCount.textContent = `Page #${this.currentGaragePage}`;
      render.addCars();
    }
  }

  private winnerBtn(target: HTMLElement): void {
    if (target.classList.contains('prev') && this.currentWinnerPage > 1) {
      this.currentWinnerPage -= 1;
      if (this.currentWinnerPage === 1) {
        toggle(['prev'], 'add');
        toggle(['next'], 'remove');
        renderWinner.winnerBtnState = [true, false];
      } else {
        toggle(['next', 'prev'], 'remove');
        renderWinner.winnerBtnState = [false, false];
      }
    }
    if (target.classList.contains('next') && this.totalWinnerCar / (this.currentWinnerPage * 10) > 1) {
      this.currentWinnerPage += 1;
      if (this.currentWinnerPage === Math.ceil(this.totalWinnerCar / 10)) {
        toggle(['prev'], 'remove');
        toggle(['next'], 'add');
        renderWinner.winnerBtnState = [false, true];
      } else {
        toggle(['next', 'prev'], 'remove');
        renderWinner.winnerBtnState = [false, false];
      }
    }
    const winnerPageCount = <HTMLDivElement>document.querySelector('.winner-pg-count');
    winnerPageCount.textContent = `Page #${this.currentWinnerPage}`;
    renderWinner.createWinnerFooterItem(renderWinner.sortMethod ? renderWinner.sortMethod : 'id', renderWinner.sortType ? renderWinner.sortType : 'ASC');
  }

  private switchGarage(): void {
    const main = <HTMLElement>document.querySelector('.garage-container');
    main.style.display = 'block';
    toggle(['prev'], `${render.garageBtnState[0] ? 'add' : 'remove'}`);
    toggle(['next'], `${render.garageBtnState[1] ? 'add' : 'remove'}`);
    const winnerCont = <HTMLDivElement>document.querySelector('.winner-container');
    winnerCont.style.display = 'none';
  }

  private switchWinner(): void {
    const main = <HTMLElement>document.querySelector('.garage-container');
    main.style.display = 'none';
    const popup = <HTMLDivElement>document.querySelector('.popup');
    popup.classList.remove('active');
    toggle(['prev'], `${renderWinner.winnerBtnState[0] ? 'add' : 'remove'}`);
    toggle(['next'], `${renderWinner.winnerBtnState[1] ? 'add' : 'remove'}`);
    const winnerCont = <HTMLDivElement>document.querySelector('.winner-container');
    winnerCont.style.display = 'block';
    renderWinner.createWinnerFooterItem('id', 'ASC');
  }

  private resetInputs(arr: HTMLInputElement[]): void {
    arr.forEach((inp, i) => { inp.value = i === 0 ? '' : '#000000'; });
  }
}

const mainHandler = new MainHandler();

export { mainHandler, toggle };
