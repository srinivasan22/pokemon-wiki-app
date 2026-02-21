import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, switchMap } from 'rxjs';

export interface Pokemon {
  name: string;
  url?: string;
  id?: number;
  sprite?: string;
  types?: Array<{ slot: number; type: { name: string } }>;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  
  public listSubject = new BehaviorSubject<Pokemon[]>([]); 
  public list$ = this.listSubject.asObservable();

  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<{ results: { name: string; url: string }[] }>('https://pokeapi.co/api/v2/pokemon')
      .pipe(
        map(response => response.results.map(p => ({
          name: p.name,
          url: p.url,
          id: this.extractId(p.url!)
        }))),
        switchMap(pokemons => 
          forkJoin(
            pokemons.map(pokemon =>
              this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`).pipe(
                map(fullData => ({
                  name: pokemon.name,
                  id: pokemon.id!,
                  sprite: fullData.sprites?.front_default,
                  types: fullData.types || []
                }))
              )
            )
          )
        )
      );
  }

  getPokemonDetails(id: number): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }

  /**
   * Load and cache the full pokemon list
   */
  loadPokemonList(): void {
    this.getPokemonList().subscribe(pokemons => {
      this.listSubject.next(pokemons);
    });
  }

  /**
   * Get cached pokemon list or load if empty
   */
  getCachedList(): Observable<Pokemon[]> {
    if (this.listSubject.value.length === 0) {
      this.loadPokemonList();
    }
    return this.list$;
  }

  private extractId(url: string): number {
    return +url.split('/').slice(-2, -1)[0];
  }
}
