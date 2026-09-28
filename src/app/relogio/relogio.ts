import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relogio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relogio.html',
  styleUrls: ['./relogio.css']
})
export class Relogio implements OnInit, OnDestroy {
  // Signal com a data/hora atual
  agora = signal<Date>(new Date());
  
  private intervalId: any;

  // Propriedades computadas automaticamente para os ponteiros do relógio analógico
  grausMinutos = computed(() => (this.agora().getMinutes() + this.agora().getSeconds() / 60) * 6);
  grausHoras = computed(() => ((this.agora().getHours() % 12) + this.agora().getMinutes() / 60) * 30); // 360 / 12

  ngOnInit() {
    // Atualiza o horário a cada 1 segundo (1000ms)
    this.intervalId = setInterval(() => {
      this.agora.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    // Limpa o intervalo para evitar vazamento de memória quando o componente for destruído
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}