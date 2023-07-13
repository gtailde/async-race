import { ICar, IWinner, IEngine, IQueryParams } from "../interface/interface";

class Api {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = "http://127.0.0.1:3000";
    }
  
    async getCars(page?: number, limit?: number): Promise<ICar[]> {
        const url = `${this.baseUrl}/garage`;
        const queryParams = this.buildQueryParams({ _page: page, _limit: limit });
        const response = await fetch(`${url}${queryParams}`);
        return response.json();
    }
  
    async getCar(id: number): Promise<ICar> {
        const url = `${this.baseUrl}/garage/${id}`;
        const response = await fetch(url);
        return response.json();
    }
  
    async createCar(name: string, color: string): Promise<ICar> {
        const url = `${this.baseUrl}/garage`;
        const data = { name, color };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }
  
    async deleteCar(id: number): Promise<void> {
        const url = `${this.baseUrl}/garage/${id}`;
        const response = await fetch(url, { method: 'DELETE' });
        return response.json();
    }
  
    async updateCar(id: number, name: string, color: string): Promise<ICar> {
        const url = `${this.baseUrl}/garage/${id}`;
        const data = { name, color };
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }
  
    async startOrStopEngine(id: number, status: 'started' | 'stopped'): Promise<IEngine> {
        const url = `${this.baseUrl}/engine`;
        const queryParams = this.buildQueryParams({ id, status });
        const response = await fetch(`${url}${queryParams}`, { method: 'PATCH' });
        return response.json();
    }
  
    async switchEngineToDriveMode(id: number): Promise<{ success: boolean }> {
        const url = `${this.baseUrl}/engine`;
        const queryParams = this.buildQueryParams({ id, status: 'drive' });
        const response = await fetch(`${url}${queryParams}`, { method: 'PATCH' });
        return response.json();
    }
  
    async getWinners(page?: number, limit?: number, sort?: 'id' | 'wins' | 'time', order?: 'ASC' | 'DESC'): Promise<IWinner[]> {
        const url = `${this.baseUrl}/winners`;
        const queryParams = this.buildQueryParams({ _page: page, _limit: limit, _sort: sort, _order: order });
        const response = await fetch(`${url}${queryParams}`);
        return response.json();
    }
  
    async getWinner(id: number): Promise<IWinner> {
        const url = `${this.baseUrl}/winners/${id}`;
        const response = await fetch(url);
        return response.json();
    }
  
    async createWinner(id: number, wins: number, time: number): Promise<IWinner> {
        const url = `${this.baseUrl}/winners`;
        const data = { id, wins, time };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }
  
    async deleteWinner(id: number): Promise<void> {
        const url = `${this.baseUrl}/winners/${id}`;
        const response = await fetch(url, { method: 'DELETE' });
        return response.json();
    }
  
    async updateWinner(id: number, wins: number, time: number): Promise<IWinner> {
        const url = `${this.baseUrl}/winners/${id}`;
        const data = { wins, time };
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }
  
    private buildQueryParams(params: IQueryParams): string {
        const queryParams = new URLSearchParams();
      
        for (const key in params) {
            if (params[key] !== undefined) {
                queryParams.append(key, String(params[key]));
            } else {
                throw new Error(`Invalid value for parameter '${key}'`);
            }
        }
      
        return queryParams.toString() ? `?${queryParams.toString()}` : '';
    }
}
    
const api = new Api;

export { api }