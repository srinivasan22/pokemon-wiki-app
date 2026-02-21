import { Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonDetailsComponent } from './pokemon-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/pokemon', pathMatch: 'full' },
  { path: 'pokemon', component: PokemonListComponent },
  { path: 'pokemon/:id', component: PokemonDetailsComponent },  // ← Make sure this exists
  { path: 'random', loadComponent: () => import('./pokemon-details.component').then(m => m.PokemonDetailsComponent) },
  { path: '**', redirectTo: '/pokemon' }  // ← Catch-all
];
