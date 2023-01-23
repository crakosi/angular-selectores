import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaisSmall } from '../interfaces/paisSamall.interface';
import { Observable, combineLatest, of } from 'rxjs';
import { Pais } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private _baseUrl: string = 'https://restcountries.com/v2';

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor( private http: HttpClient) { }

  getPaisesByRegion( region: string): Observable<PaisSmall[]>{
    const url: string =  `${ this._baseUrl }/region/${ region }?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>( url );
  }

  getPaisByCode( codigo: string ): Observable<Pais[]| []>{
    if(!codigo){
      return of([]);
    }
    console.log(codigo);

    const url : string = `${ this._baseUrl}/alpha/${ codigo }`;

    return this.http.get<Pais[]>( url );
  }

  getPaisByCodeSmall( codigo: string ): Observable<PaisSmall>{
   const url : string = `${ this._baseUrl}/alpha/${codigo}?fields=alpha3Code;name`;
    return this.http.get<PaisSmall>( url );
  }

  getPaisesByCodes( borders: string []): Observable<PaisSmall[]>{
    if(!borders){
      return of([])
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach( codigo => {
      const peticion = this.getPaisByCodeSmall( codigo );
      peticiones.push( peticion );
    });
    return combineLatest( peticiones );
  }

}
