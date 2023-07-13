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

interface IEngine {
    velocity: number; 
    distance: number;
}

interface IQueryParams {
    [key: string]: string | number | boolean | undefined;
}

export { ICar, IWinner, IEngine, IQueryParams }