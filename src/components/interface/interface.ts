interface ICar {
    name: string;
    color: string;
    id: number;
}

interface IWinner {
    id: number;
    wins: number;
    time: number;
}

interface IWinnersResponse {
    totalCount: number;
    winners: IWinner[];
}

interface IEngine {
    velocity: number;
    distance: number;
}

interface IQueryParams {
    [key: string]: string | number | boolean | undefined;
}

interface ICarsResponse {
    totalCount: number;
    cars: ICar[];
}

interface IGetWinners {
    sort: 'id' | 'wins' | 'time',
    order: 'ASC' | 'DESC',
}

export {
  ICar, IWinner, IEngine, IQueryParams, ICarsResponse, IGetWinners, IWinnersResponse,
};
