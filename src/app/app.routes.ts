import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { Calendario } from './calendario/calendario';
import { Musicas } from './musicas/musicas';
import { Relogio } from './relogio/relogio';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Adicione o pathMatch: 'full'
  { path: 'calendario', component: Calendario },
  { path: 'musicas', component: Musicas},
  {path: 'relogio', component: Relogio}
];