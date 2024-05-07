import { ICard } from '@interfaces/card/card.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  create(userId: string, card: ICard): Observable<ICard> {
    return this.http.post<ICard>(`${this.baseUrl}/card/${userId}`, card);
  }

  get(userId: string, filters?: Partial<ICard>): Observable<ICard[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof ICard];
        if (value !== null && value !== undefined) {
          params = params.append(key, value.toString());
        }
      });
    }
    return this.http.get<ICard[]>(`${this.baseUrl}/card/${userId}`, { params });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/card/${id}`);
  }

  update(id: string, card: ICard): Observable<ICard> {
    return this.http.patch<ICard>(`${this.baseUrl}/card/${id}`, card);
  }
}
