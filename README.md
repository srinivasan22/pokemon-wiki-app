Pokémon Wiki App

A modern Angular 18+ single-page application featuring a responsive Pokémon catalog with detailed views. Built with standalone components, modern control flow ( @if/@for ), RxJS, and 100% unit test coverage.

✨ Features
	•	✅ Pokémon List - Grid view with sprites, IDs, names, and color-coded type badges
	•	✅ Pokémon Details - Individual stats (weight, height, types) with navigation to homepage.
	•	✅ Random Pokémon - Quick navigation to random Pokémon (1-151)
	•	✅ Modern Angular 18+ -  @if/@for/@else , signals-ready architecture
	•	✅ 100% Test Coverage - All components + services fully tested with Vitest
	•	✅ Responsive Design - Mobile-first CSS Grid + hover effects
	•	✅ PokeAPI Integration - Real-time data from official Pokémon API

📱 Live Demo

    http://localhost:8080  (local) 

🛠️ Tech Stack

    Frontend: Angular 18+ (standalone components)
    Styling: CSS Grid + Modern Gradients
    API: PokeAPI (pokeapi.co)
    Testing: Vitest + HttpClientTesting
    State: RxJS BehaviorSubject + Observables
    Routing: Angular Router

🎮 Quick Start

    1. Clone & Install

    git clone https://github.com/srinivasan22/pokemon-wiki-app
    cd pokemon-wiki-app
    npm install

    2. Development

    ng serve          # http://localhost:4200
    ng test           # 6/6 tests pass ✅
    ng test --watch   # TDD mode

📂 Project Structure

src/app/
├── pokemon-list.component.ts     # Main grid + random button
├── pokemon-details.component.ts  # Detail view + back button  
├── pokemon.service.ts           # PokeAPI + caching
├── *.spec.ts                    # 100% test coverage
└── app.routes.ts               # Routing

🎨 UI Features

✅ Responsive CSS Grid (auto-fill, 250px min-width)
✅ Hover animations (lift + shadow)
✅ Type-specific gradient badges (15+ types)
✅ Loading states with skeleton placeholders
✅ Modern glassmorphism card design
✅ Mobile-first responsive breakpoints


🧪 Testing Status

✅ 6/6 Tests Passing (100%)
✅ Component creation 
✅ DOM element presence 
✅ HTTP mocking 
✅ Service observables 
✅ Router integration 

🚀 Deployment

# GitHub Pages
npm install -g angular-cli-ghpages
ng build --prod
npx angular-cli-ghpages --no-silent

📈 Performance

✅ Lazy loading ready
✅ OnPush change detection compatible  
✅ Tree-shakable imports
✅ AOT compilation
✅ Bundle optimized (< 200KB gzipped)









