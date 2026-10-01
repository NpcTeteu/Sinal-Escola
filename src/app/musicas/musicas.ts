import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importou Location
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importou Router caso prefira rota fixa

@Component({
  selector: 'app-musicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './musicas.html',
  styleUrls: ['./musicas.css']
})
export class MusicasComponent {
  playlists: string[] = ['Nome da PlayList', 'Nome da PlayList'];
  indexAtual: number = 0;

  get playlistSelecionada(): string {
    return this.playlists[this.indexAtual] || 'Sem Playlist';
  }

  // Controle dos modais
  modalAberto: boolean = false;
  modoEdicao: boolean = false;
  novoNomePlaylist: string = '';

  // Modal para escolher a exclusão
  modalExcluirAberto: boolean = false;
  indexExcluir: number = 0;

  constructor(private router: Router, private location: Location) {}

  // Função para voltar à rota inicial ou à página anterior
  voltar(): void {
    // Opção 1: Volta para a página anterior no histórico
    this.location.back();

    // Opção 2: Descomente abaixo se preferir redirecionar para uma rota específica como '/home'
    // this.router.navigate(['/home']);
  }

  selecionarPlaylist(index: number): void {
    this.indexAtual = index;
  }

  abrirModalAdicionar(): void {
    this.modoEdicao = false;
    this.novoNomePlaylist = '';
    this.modalAberto = true;
  }

  abrirModalEditar(): void {
    if (this.playlists.length === 0) return;
    this.modoEdicao = true;
    this.novoNomePlaylist = this.playlistSelecionada;
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalExcluirAberto = false;
  }

  salvarPlaylist(): void {
    const nomeFormatado = this.novoNomePlaylist.trim();
    if (!nomeFormatado) return;

    if (this.modoEdicao) {
      this.playlists[this.indexAtual] = nomeFormatado;
    } else {
      this.playlists.push(nomeFormatado);
      this.indexAtual = this.playlists.length - 1;
    }

    this.fecharModal();
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

    this.fecharModal();
  }
}