import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface PokemonDetails {
  id: number;
  name: string;
  sprites: { 
    front_default: string;
  };
  weight: number;
  height: number;
  types: Array<{ 
    slot: number; 
    type: { name: string } 
  }>;
}

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="details-header">    
      <div style="visibility: hidden; width: 150px;"></div>    
      <button class="back-button" (click)="goBack()">← Back</button>
    </header>

    @if (pokemon$ | async; as pokemon) {
      <div class="card">
        <img [src]="pokemon.sprites.front_default" [alt]="pokemon.name">
        <h1>{{ pokemon.name | titlecase }}</h1>
        <p>ID: #{{ pokemon.id }}</p>
        <p>Weight: {{ pokemon.weight }} lbs</p>
        <p>Height: {{ pokemon.height }}' {{ pokemon.height * 10 }}cm</p>
        
        <div class="types">
          @for (typeObj of pokemon.types; track typeObj.type.name) {
            <span class="type-badge type-{{typeObj.type.name}}">
              {{ typeObj.type.name | titlecase }}
            </span>
          }
        </div>
      </div>
    } @else {
      <div class="loading">Loading Pokémon details...</div>
    }
  `,
  styles: [`
    .details-header {                         
      position: relative;           
      height: 80px;           
      padding: 0 2rem;  
    }

    .back-button {
      position: absolute;
      top: 2rem;                   
      right: 2rem;                
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.2s;
      font-weight: 600;
    }
    
    .back-button:hover {
      transform: translateY(-2px);
    }
    
    .card {
      max-width: 400px;
      margin: 0 auto 2rem;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      text-align: center;
    }
    
    .card img {
      width: 200px;
      height: 200px;
      margin-bottom: 1rem;
      border-radius: 12px;
    }
    
    h1 {
      font-size: 2rem;
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .card p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
      color: #666;
    }
    
    .types {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    
    .type-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: white;
    }
    
    .type-grass { background: linear-gradient(45deg, #4caf50, #81c784); }
    .type-poison { background: linear-gradient(45deg, #9c27b0, #ba68c8); }
    .type-fire { background: linear-gradient(45deg, #ff5722, #ff8a65); }
    .type-water { background: linear-gradient(45deg, #2196f3, #64b5f6); }
    .type-bug { background: linear-gradient(45deg, #8bc34a, #aed581); }
    .type-normal { background: linear-gradient(45deg, #A8A878, #C8C8A8); }
    .type-flying { background: linear-gradient(45deg, #A890F0, #C8B8F8); }
    .type-ground { background: linear-gradient(45deg, #E0C068, #F0D098); }
    .type-electric { background: linear-gradient(45deg, #ffeb3b, #fff176); color: #333; }
    .type-fairy { background: linear-gradient(45deg, #c322a5ff, #ee6ff5); }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
      text-align: center;
      font-size: 1.2rem;
      color: #666;
    }
  `]
})
export class PokemonDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private location = inject(Location);
  
  pokemon$: Observable<PokemonDetails> = this.route.paramMap.pipe(
    switchMap(params => 
      this.http.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${params.get('id')}`)
    )
  );

  ngOnInit() {
    // Ensure proper initialization for standalone component
  }

  goBack() {
    this.location.back(); 
  }
}
