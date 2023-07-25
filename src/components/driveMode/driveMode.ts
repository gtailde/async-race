import api from '../api/api';
import { mainHandler, toggle } from '../pages/renderMainPg/mainHandler';
import render from '../pages/renderMainPg/renderMainPg';

class DriveMode {
  public intervalIds: NodeJS.Timer[] = [];

  private activeCars: number[] = [];

  private finishedCar: string | null = null;

  public status: 'drive' | 'race' | null = null;

  public driveCar(carIcon: HTMLDivElement, time: number, carIndex: number, velocity?: number):void {
    const endPosition = window.innerWidth - 205;
    const timeToFinish = velocity ? 5000 / (velocity * 7) : 0;
    const speed = endPosition / time;
    let currentPosition = 0;

    const intervalId = setInterval(async () => {
      if (currentPosition >= endPosition) {
        if (!this.finishedCar && this.status === 'race') {
          const carContainer = <HTMLDivElement>document.getElementById(`${carIndex}`);
          const carName = carContainer.querySelector('.car-name')?.textContent;
          this.finishedCar = `${carName} wont first [${timeToFinish.toFixed(2)}s]!`;
          const getWinner = await api.getWinner(carIndex);
          if (getWinner) {
            const updatedWins = getWinner.wins + 1;
            const updatedTime = getWinner.time > timeToFinish ? timeToFinish
              .toFixed(2) : getWinner.time;
            await api.updateWinner(carIndex, updatedWins, Number(updatedTime));
          } else {
            await api.createWinner(carIndex, 1, Number(timeToFinish.toFixed(2)));
          }
          if (mainHandler.activePage === 'garage') render.drawPopUp(this.finishedCar);
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

  async stopCar(carIndex: number): Promise<void> {
    await api.startOrStopEngine(carIndex, 'stopped');
    const indexInActiveCars = this.activeCars.indexOf(carIndex);
    const intervalId = this.intervalIds[indexInActiveCars];
    clearInterval(intervalId);
    this.activeCars.splice(indexInActiveCars, 1);
    this.intervalIds.splice(indexInActiveCars, 1);
    if (this.intervalIds.length === 0 && this.activeCars.length === 0) {
      if (this.status === 'race' || this.status === 'drive') {
        this.status = null;
        this.finishedCar = null;
        setTimeout(() => {
          toggle(['reset'], 'remove');
        }, 1000);
      }
    }
  }

  resetCars(carIcons: HTMLDivElement[]): void {
    carIcons.forEach((carIcon) => {
      const gameContainer = <HTMLDivElement>carIcon.closest('.game-container');
      const btnA = <HTMLButtonElement>gameContainer.querySelector('.btn-a');
      const btnB = <HTMLButtonElement>gameContainer.querySelector('.btn-b');
      btnA.disabled = !btnA.disabled;
      btnB.disabled = !btnB.disabled;
      carIcon.style.transform = 'translateX(0px)';
    });
  }

  public stopAllCars(): void {
    this.activeCars.forEach((carIndex) => this.stopCar(carIndex));
  }
}

const driveMode = new DriveMode();

export default driveMode;
