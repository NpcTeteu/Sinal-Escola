import { Component, OnInit, ElementRef, ViewChild, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-musicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './musicas.html',
  styleUrls: ['./musicas.css']
})
export class MusicasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('roletaContainer') roletaContainer!: ElementRef<HTMLDivElement>;

  playlists: string[] = [];
  indexAtual: number = 0;
  discoGirandoIndex: number | null = null;

  private scrollTimer: any;
  private ticking: boolean = false;

  get playlistSelecionada(): string {
    return this.playlists[this.indexAtual] || 'Sem Playlist';
  }

  // Modais
  modalAberto: boolean = false;
  modoEdicao: boolean = false;
  novoNomePlaylist: string = '';

  indexEdicao: number = 0;
  modalExcluirAberto: boolean = false;
  indexExcluir: number = 0;

  constructor(private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.carregarPlaylists();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.centralizarPlaylist(this.indexAtual, 'auto');
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  onScrollContainer(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.atualizarIndexMaisProximo();
        this.ticking = false;
      });
      this.ticking = true;
    }

    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.centralizarPlaylist(this.indexAtual, 'smooth');
    }, 400);
  }

  atualizarIndexMaisProximo(): void {
    if (!this.roletaContainer) return;
    const container = this.roletaContainer.nativeElement;
    const blocos = container.querySelectorAll('.bloco-playlist');
    const containerRect = container.getBoundingClientRect();
    const centroContainer = containerRect.top + containerRect.height / 2;

    let indexMaisProximo = 0;
    let menorDistancia = Infinity;

    blocos.forEach((bloco, index) => {
      const target = bloco as HTMLElement;
      const targetRect = target.getBoundingClientRect();
      const centroTarget = targetRect.top + targetRect.height / 2;
      const distancia = Math.abs(centroContainer - centroTarget);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        indexMaisProximo = index;
      }
    });

    if (this.indexAtual !== indexMaisProximo) {
      this.indexAtual = indexMaisProximo;
    }
  }

  centralizarPlaylist(index: number, behavior: ScrollBehavior = 'smooth'): void {
    if (!this.roletaContainer) return;
    const container = this.roletaContainer.nativeElement;
    const blocos = container.querySelectorAll('.bloco-playlist');

    if (blocos[index]) {
      const target = blocos[index] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const centroContainer = containerRect.top + containerRect.height / 2;
      const centroTarget = targetRect.top + targetRect.height / 2;
      const diff = centroTarget - centroContainer;

      if (Math.abs(diff) > 3) {
        container.scrollBy({
          top: diff,
          behavior: behavior
        });
      }
    }
  }

  selecionarECentralizar(index: number): void {
    this.indexAtual = index;
    this.centralizarPlaylist(index, 'smooth');
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.modalAberto || this.modalExcluirAberto) return;

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.indexAtual > 0) {
        this.selecionarECentralizar(this.indexAtual - 1);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.indexAtual < this.playlists.length - 1) {
        this.selecionarECentralizar(this.indexAtual + 1);
      }
    }
  }

  carregarPlaylists(): void {
    const salvas = localStorage.getItem('minhas_playlists');
    if (salvas) {
      this.playlists = JSON.parse(salvas);
    } else {
      this.playlists = ['Minha Playlist 1', 'Minha Playlist 2', 'Minha Playlist 3'];
      this.salvarNoLocalStorage();
    }
  }

  salvarNoLocalStorage(): void {
    localStorage.setItem('minhas_playlists', JSON.stringify(this.playlists));
  }

  voltar(): void {
    this.location.back();
  }

  girarDisco(index: number, event: Event): void {
    event.stopPropagation();
    if (this.discoGirandoIndex === index) {
      this.discoGirandoIndex = null;
    } else {
      this.discoGirandoIndex = index;
    }
  }

  gerarNomeSugerido(): string {
    let maiorNumero = 1;
    for (const p of this.playlists) {
      const match = p.match(/^Minha Playlist (\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= maiorNumero) {
          maiorNumero = num + 1;
        }
      }
    }
    return `Minha Playlist ${maiorNumero}`;
  }

  abrirModalAdicionar(): void {
    this.modoEdicao = false;
    this.novoNomePlaylist = this.gerarNomeSugerido();
    this.modalAberto = true;
  }

  abrirModalEditar(): void {
    if (this.playlists.length === 0) return;
    this.modoEdicao = true;
    this.indexEdicao = this.indexAtual;
    this.atualizarNomeEdicao();
    this.modalAberto = true;
  }

  atualizarNomeEdicao(): void {
    this.novoNomePlaylist = this.playlists[this.indexEdicao] || '';
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalExcluirAberto = false;
  }

  salvarPlaylist(): void {
    const nomeFormatado = this.novoNomePlaylist.trim();
    if (!nomeFormatado) return;

    if (this.modoEdicao) {
      this.playlists[this.indexEdicao] = nomeFormatado;
    } else {
      this.playlists.push(nomeFormatado);
      this.indexAtual = this.playlists.length - 1;
    }

    this.salvarNoLocalStorage();
    this.fecharModal();

    setTimeout(() => {
      this.centralizarPlaylist(this.indexAtual);
    }, 100);
  }

  abrirModalExcluir(): void {
    if (this.playlists.length <= 1) {
      alert('Você precisa ter pelo menos uma playlist!');
      return;
    }
    this.indexExcluir = this.indexAtual;
    this.modalExcluirAberto = true;
  }

  confirmarExclusao(): void {
    if (this.playlists.length <= 1) {
      alert('Você precisa ter pelo menos uma playlist!');
      this.fecharModal();
      return;
    }

    this.playlists.splice(this.indexExcluir, 1);

    if (this.indexAtual >= this.playlists.length) {
      this.indexAtual = this.playlists.length - 1;
    }

    this.salvarNoLocalStorage();
    this.fecharModal();

    setTimeout(() => {
      this.centralizarPlaylist(this.indexAtual);
    }, 100);
  }
}