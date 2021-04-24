import axios from 'axios';

import { IRoute } from './route';

// Class
export class JanusGate {
  // Attributes
  private readonly axios = axios.create({
    baseURL: 'http://localhost:5000'
  });

  // Methods
  async addTarget(name: string, target: string): Promise<void> {
    await this.axios.put<IRoute>(`/route/${name}`, { target });
  }
}
