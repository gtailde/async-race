import api from '../api/api';
import { toggle } from '../pages/renderMainPg/mainHandler';
import render from '../pages/renderMainPg/renderMainPg';

class DriveMode {
  public intervalIds: NodeJS.Timer[] = [];

  private activeCars: number[] = [];

  private finishedCar: string | null = null;

  public status: 'drive' | 'race' | null = null;

  driveCar(carIcon: HTMLDivElement, time: number, carIndex: number, velocity?: number) {
    const endPosition = window.innerWidth - 205;
    const speed = endPosition / time;
    const timeToFinish = velocity ? 5000 / (velocity * 5) : 0;
    let currentPosition = 0;

    const intervalId = setInterval(() => {
      if (currentPosition >= endPosition) {
        if (!this.finishedCar && this.status === 'race') {
          const carContainer = <HTMLDivElement>document.getElementById(`${carIndex}`);
          const carName = carContainer.querySelector('.car-name')?.textContent;
          this.finishedCar = `${carName} wont first [${timeToFinish.toFixed(2)}s]!`;
          render.drawPopUp(this.finishedCar);
        }
        this.stopCar(carIndex);
        clearInterval(intervalId);
        return;
      }
      carIcon.style.transform = `translateX(${currentPosition}px)`;
      currentPosition += speed;
    }, 10);

    this.intervalIds.push(intervalId);
    this.activeCars.push(carIndex);
  }

  async stopCar(carIndex: number) {
    await api.startOrStopEngine(carIndex, 'stopped');
    const indexInActiveCars = this.activeCars.indexOf(carIndex);
    const intervalId = this.intervalIds[indexInActiveCars];
    clearInterval(intervalId);
    this.activeCars.splice(indexInActiveCars, 1);
    this.intervalIds.splice(indexInActiveCars, 1);

    if (this.activeCars.length === 0) {
      if (this.status === 'race' || this.status === 'drive') {
        this.status = null;
      }
      toggle(['reset'], 'remove');
      this.finishedCar = null;
    }
  }

  resetCars(carIcons: HTMLDivElement[]) {
    carIcons.forEach((carIcon) => {
      const gameContainer = carIcon.closest('.game-container') as HTMLDivElement;
      const btnA = gameContainer.querySelector('.btn-a') as HTMLButtonElement;
      const btnB = gameContainer.querySelector('.btn-b') as HTMLButtonElement;
      btnA.disabled = !btnA.disabled;
      btnB.disabled = !btnB.disabled;
      carIcon.style.transform = 'translateX(0px)';
    });
  }
}

const driveMode = new DriveMode();

export default driveMode;
