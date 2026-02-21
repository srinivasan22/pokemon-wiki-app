import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap, BehaviorSubject } from 'rxjs';

interface PokemonListItem {
  name: string;
  url: string;
}

interface Pokemon {
  name: string;
  id: number;
  sprite?: string;
  types?: Array<{ slot: number; type: { name: string } }>;
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header>
      <h1>Poké Wiki App</h1>
      <button (click)="getRandomPokemon()">Random Pokémon</button>
    </header>
    
    @if (pokemonList$ | async; as pokemonList) {
      <div class="grid">
        @for (pokemon of pokemonList; track pokemon.id) {
          <a [routerLink]="['/pokemon', pokemon.id]" class="pokemon-card">
            @if (pokemon.sprite) {
              <img [src]="pokemon.sprite" [alt]="pokemon.name">
            }
            <span>#{{ pokemon.id }}</span>
            <h3>{{ pokemon.name | titlecase }}</h3>
            @if (pokemon.types?.length) {
              <div class="types">
                @for (typeObj of pokemon.types; track typeObj.type.name) {
                  <span class="type-badge type-{{typeObj.type.name}}">
                    {{ typeObj.type.name | titlecase }}
                  </span>
                }
              </div>
            }
          </a>
        }
      </div>
    } @else {
      <div class="loading">Loading Pokémon...</div>
    }
  `,
  styles: [`
    :host { display: block; padding: 2rem; }
    header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 2rem; 
    }
    h1 { margin: 0; font-size: 2.5rem; color: #333; }
    button { 
      padding: 0.75rem 1.5rem; 
      background: linear-gradient(45deg, #667eea, #764ba2); 
      color: white; 
      border: none; 
      border-radius: 25px; 
      font-size: 1rem; 
      cursor: pointer; 
      transition: transform 0.2s; 
    }
    button:hover { transform: translateY(-2px); }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
      gap: 2rem; 
      max-width: 1200px; 
      margin: 0 auto; 
    }
    .pokemon-card { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      padding: 0.7rem; 
      border-radius: 20px; 
      box-shadow: 0 8px 25px rgba(0,0,0,0.1); 
      text-decoration: none; 
      color: inherit; 
      transition: all 0.3s ease; 
      background: white; 
      height: 100%; 
    }
    .pokemon-card:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 15px 40px rgba(0,0,0,0.2); 
    }
    .pokemon-card img { width: 120px; height: 120px; margin-bottom: 1rem; }
    .pokemon-card span { font-size: 0.9rem; color: #fff; font-weight: 600; }
    .pokemon-card h3 { margin: 0.5rem 0; font-size: 1.3rem; color: #333; }
    .types { display: flex; gap: 0.5rem; margin-top: auto; flex-wrap: wrap; }
    .type-badge { 
      padding: 0.3rem 0.6rem; 
      border-radius: 15px; 
      font-size: 0.75rem; 
      font-weight: 600; 
      color: white; 
    }
    .type-grass { background: #4caf50; }
    .type-poison { background: #9c27b0; }
    .type-fire { background: #ff5722; }
    .type-water { background: #2196f3; }
    .type-bug { background: #8BC34A; }
    .type-normal { background: #A8A878; }
    .type-flying { background: #A890F0; }
    .type-ground { background: #E0C068; }
    .type-electric { background: #ffeb3b; color: #333; }
    .type-fairy { background: #c322a5ff; }
    .loading { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 300px; 
      font-size: 1.5rem; 
      color: #666; 
    }
  `]
})
export class PokemonListComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router); 
  
  private pokemonListSubject = new BehaviorSubject<Pokemon[]>([]);
  pokemonList$ = this.pokemonListSubject.asObservable();

  ngOnInit() {
    this.loadPokemonList();
  }

  private extractId(url: string): number {
    return Number(url.split('/').slice(-2, -1)[0]);
  }

  private loadPokemonList() {
    this.getPokemonList().subscribe(pokemons => {
      this.pokemonListSubject.next(pokemons);
    });
  }

  getPokemonList(): Observable<Pokemon[]> {
    return this.http.get<{ results: PokemonListItem[] }>('https://pokeapi.co/api/v2/pokemon?limit=50').pipe(
      map(response => response.results.map(p => ({
        name: p.name,
        id: this.extractId(p.url),
        sprite: '',
        types: []
      }))),
      switchMap(pokemons => 
        forkJoin(
          pokemons.map(pokemon =>
            this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`).pipe(
              map(fullData => ({
                name: pokemon.name,
                id: pokemon.id,
                sprite: fullData.sprites.front_default,
                types: fullData.types || []
              }))
            )
          )
        )
      )
    );
  }

  getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    this.router.navigate(['/pokemon', randomId]);
  }
}
