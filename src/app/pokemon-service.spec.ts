import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pokemon list', () => {
  const mockPokemons = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1' }];
  
  service.getPokemonList().subscribe(pokemons => {
    expect(pokemons.length).toBe(1);
  });
  
  httpMock.expectOne('https://pokeapi.co/api/v2/pokemon').flush({ results: mockPokemons });
  
  const nanReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/NaN');
  nanReq.flush({ 
    sprites: { front_default: 'sprite.png' }, 
    name: 'bulbasaur'
  });
});

  afterEach(() => {
    httpMock.verify();
  });
});
