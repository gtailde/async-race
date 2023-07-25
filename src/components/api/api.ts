import {
  ICar, IWinner, IEngine, IQueryParams, ICarsResponse, IGetWinners, IWinnersResponse,
} from '../interface/interface';

class Api {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
  }

  public async getCars(page?: number, limit?: number): Promise<ICarsResponse> {
    try {
      const url = `${this.baseUrl}/garage`;
      const queryParams = this.buildQueryParams({ _page: page, _limit: limit });
      const response = await fetch(`${url}${queryParams}`);
      const cars = await response.json();
      const totalCountHeader = response.headers.get('X-Total-Count');
      const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
      return { totalCount, cars };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getCar(id: number): Promise<ICar> {
    try {
      const url = `${this.baseUrl}/garage/${id}`;
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createCar(name: string, color: string): Promise<ICar> {
    try {
      const url = `${this.baseUrl}/garage`;
      const data = { name, color };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async deleteCar(id: number): Promise<void> {
    try {
      const url = `${this.baseUrl}/garage/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateCar(id: number, name: string, color: string): Promise<ICar> {
    try {
      const url = `${this.baseUrl}/garage/${id}`;
      const data = { name, color };
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async startOrStopEngine(id: number, status: 'started' | 'stopped'): Promise<IEngine> {
    try {
      const url = `${this.baseUrl}/engine`;
      const queryParams = this.buildQueryParams({ id, status });
      const response = await fetch(`${url}${queryParams}`, { method: 'PATCH' });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async switchEngineToDriveMode(id: number): Promise<{ success: boolean }> {
    try {
      const url = `${this.baseUrl}/engine`;
      const queryParams = this.buildQueryParams({ id, status: 'drive' });
      const response = await fetch(`${url}${queryParams}`, { method: 'PATCH' });
      if (response.status === 500) {
        return { success: false };
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  public async getWinners(page?: number, limit?: number, sort?: IGetWinners['sort'], order?: IGetWinners['order']): Promise<IWinnersResponse> {
    try {
      const url = `${this.baseUrl}/winners`;
      const queryParams = this.buildQueryParams({
        _page: page, _limit: limit, _sort: sort, _order: order,
      });
      const response = await fetch(`${url}${queryParams}`);
      const totalCountHeader = response.headers.get('X-Total-Count');
      const totalWinnersCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
      const winners: IWinner[] = await response.json();
      return { totalCount: totalWinnersCount, winners };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getWinner(id: number): Promise<IWinner | null> {
    try {
      const url = `${this.baseUrl}/winners/${id}`;
      const response = await fetch(url);
      if (response.status === 404) return null;
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createWinner(id: number, wins: number, time: number): Promise<IWinner> {
    try {
      const url = `${this.baseUrl}/winners`;
      const data = { id, wins, time };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async deleteWinner(id: number): Promise<void> {
    try {
      const url = `${this.baseUrl}/winners/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async updateWinner(id: number, wins: number, time: number): Promise<IWinner> {
    try {
      const url = `${this.baseUrl}/winners/${id}`;
      const data = { wins, time };
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private buildQueryParams(params: IQueryParams): string {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        queryParams.append(key, String(params[key]));
      } else {
        throw new Error(`Invalid value for parameter '${key}'`);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  }
}

const api = new Api();

export default api;
