import api from '../../api/api';
import driveMode from '../../driveMode/driveMode';
import generate from '../../generateCar/generateCar';
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

  public currentPage: number;

  public totalCar: number;

  private textInp: NodeList | null;

  private colorInp: NodeList | null;

  constructor() {
    this.currentCar = -1;
    this.currentPage = 1;
    this.totalCar = 0;
    this.textInp = null;
    this.colorInp = null;
  }

  public headerHandler(event: Event): void {
    const { classList } = <HTMLElement>event.target;
    if (classList.contains('garage')) {
      // ...
    } else if (classList.contains('results')) {
      // ...
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
      const time = started.distance / (started.velocity * 5);
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
        toggle(['create-name', 'create-color', 'create-car', 'generate-cars', 'race'], 'add');
        driveMode.resetCars([carIcon]);
        const started = await api.startOrStopEngine((Number(clickedCar.id)), 'started');
        driveMode
          .driveCar(carIcon, started.distance / (started.velocity * 10), Number(clickedCar.id));
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
    if (driveMode.status === null && (target.classList.contains('prev') || target.classList.contains('next'))) {
      if (target.classList.contains('prev') && this.currentPage > 1) {
        this.currentPage -= 1;
        if (this.currentPage === 1) {
          toggle(['prev'], 'add');
        } else {
          toggle(['next', 'prev'], 'remove');
        }
      }
      if (target.classList.contains('next') && this.totalCar / (this.currentPage * 7) > 1) {
        this.currentPage += 1;
        if (this.currentPage === Math.ceil(this.totalCar / 7)) {
          toggle(['next'], 'add');
        } else {
          toggle(['next', 'prev'], 'remove');
        }
      }
      const pageCount = document.querySelector('.page-count') as HTMLDivElement;
      pageCount.textContent = `Page #${this.currentPage}`;
      render.addCars();
    }
  }

  private resetInputs(arr: HTMLInputElement[]): void {
    arr.forEach((inp, i) => { inp.value = i === 0 ? '' : '#000000'; });
  }
}

const mainHandler = new MainHandler();

export { mainHandler, toggle };
