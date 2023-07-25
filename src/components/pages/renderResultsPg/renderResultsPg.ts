import createHtmlElement from '../../../utils/createHtmlElement';
import renderCar from '../renderMainPg/renderCar';
import api from '../../api/api';
import { mainHandler } from '../renderMainPg/mainHandler';
import { IGetWinners } from '../../interface/interface';

class RenderWinnerPg {
  public winnerBtnState: boolean[];

  public currentWinnerPage: number;

  public totalWinnerCar: number;

  public sortMethod: IGetWinners['sort'] | '';

  public sortType: IGetWinners['order'] | '';

  constructor() {
    this.winnerBtnState = [true, false];
    this.currentWinnerPage = 1;
    this.totalWinnerCar = 0;
    this.sortMethod = '';
    this.sortType = '';
  }

  public async createWinnerFooterItem(method: IGetWinners['sort'], type: IGetWinners['order']): Promise<void> {
    const winnerFooterList = <HTMLDivElement>document.querySelector('.winner-list-footer');
    winnerFooterList.innerHTML = '';
    const winnerTitle = <HTMLElement>document.querySelector('.winner-title');
    const winnerCarsData = await api.getWinners(mainHandler.currentWinnerPage, 10, method, type);
    winnerTitle.textContent = `Winners (${winnerCarsData.totalCount})`;
    mainHandler.totalWinnerCar = winnerCarsData.totalCount;
    winnerCarsData.winners.forEach(async (val) => {
      const getCar = await api.getCar(val.id);
      const winnerFooterItem = createHtmlElement('winner-footer-item');
      const carNumberElement = createHtmlElement('car-number', 'div', `${val.id}`);
      const carLogo = createHtmlElement('car-logo', 'div');
      carLogo.innerHTML = renderCar(getCar.color, 40);
      const winnerCarName = createHtmlElement('winner-car-name', 'div', `${getCar.name}`);
      const winsCount = createHtmlElement('wins-count', 'div', `${val.wins}`);
      const bestTimeElement = createHtmlElement('best-time', 'div', `${val.time}`);
      winnerFooterItem.append(carNumberElement, carLogo, winnerCarName, winsCount, bestTimeElement);
      winnerFooterList.append(winnerFooterItem);
    });
  }

  public renderWinnerPg(): HTMLElement {
    const winnerContainer = <HTMLDivElement>createHtmlElement('winner-container');
    winnerContainer.style.display = 'none';
    const winnerTitle = createHtmlElement('winner-title', 'h2', 'Winners (1)');
    const winnerPgCount = createHtmlElement('winner-pg-count', 'h3', 'Page #1');
    const winnerList = createHtmlElement('winner-list');
    const winnerListHeader = createHtmlElement('winner-list-header');
    const winnerListFooter = createHtmlElement('winner-list-footer');
    const sortableNumber = createHtmlElement('sortable', 'div', 'Number');
    const carDiv = createHtmlElement('', 'div', 'Car');
    const nameDiv = createHtmlElement('', 'div', 'Name');
    const sortableWins = createHtmlElement('sortable', 'div', 'Wins');
    const sortableBestTime = createHtmlElement('sortable', 'div', 'Best time (seconds)');
    winnerListHeader.append(sortableNumber, carDiv, nameDiv, sortableWins, sortableBestTime);
    winnerList.append(winnerListHeader, winnerListFooter);
    winnerContainer.append(winnerTitle, winnerPgCount, winnerList);
    this.winnerHandler([sortableNumber, sortableWins, sortableBestTime] as HTMLDivElement[]);
    return winnerContainer;
  }

  private winnerHandler(sortableItems: HTMLDivElement[]): void {
    sortableItems.forEach((item) => {
      item.addEventListener('click', () => {
        let currentDirection = '';
        if (item.classList.contains('ASC')) {
          currentDirection = 'ASC';
        } else if (item.classList.contains('DESC')) {
          currentDirection = 'DESC';
        }
        sortableItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('ASC', 'DESC');
          }
        });
        let method: IGetWinners['sort'] = 'id';
        let order: IGetWinners['order'] = 'ASC';
        if (currentDirection === 'ASC') {
          item.classList.remove('ASC');
          item.classList.add('DESC');
        } else {
          item.classList.remove('DESC');
          item.classList.add('ASC');
        }
        if (item.textContent === 'Wins') {
          method = 'wins';
        } else if (item.textContent === 'Best time (seconds)') {
          method = 'time';
        }
        if (currentDirection === '' || currentDirection === 'DESC') {
          order = 'DESC';
        } else order = 'ASC';
        this.sortMethod = method;
        this.sortType = order;
        this.createWinnerFooterItem(method, order);
      });
    });
  }
}

const renderWinner = new RenderWinnerPg();

export default renderWinner;
