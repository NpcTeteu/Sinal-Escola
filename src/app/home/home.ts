import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Relogio } from '../relogio/relogio';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [RouterLink, Relogio]
})
export class HomeComponent {

  // Variável para controlar se está tocando ou não
  isTocando: boolean = false;

  // Função para alternar o estado
  togglePlayPause(): void {
    this.isTocando = !this.isTocando;
  
  }
}