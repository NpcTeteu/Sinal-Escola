import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-musicas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './musicas.html',
  styleUrls: ['./musicas.css']
})
export class MusicasComponent {
  playlists: string[] = ['Minha PlayList 1'];
  playlistSelecionada: string = 'Minha PlayList 1';

  // Inicia como FALSE para o modal não aparecer ao carregar a página
  modalAberto: boolean = false;
  novoNomePlaylist: string = '';

  // Chamado ao clicar no botão "Adicionar"
  abrirModal(): void {
    this.modalAberto = true;
    this.novoNomePlaylist = '';
  }

  // Chamado ao clicar no botão "Cancelar"
  fecharModal(): void {
    this.modalAberto = false;
  }

  // Chamado ao clicar no botão "Salvar" ou pressionar Enter
  adicionarPlaylist(): void {
    const nomeFormatado = this.novoNomePlaylist.trim();
    if (nomeFormatado !== '') {
      this.playlists.push(nomeFormatado);
      this.playlistSelecionada = nomeFormatado; // Muda automaticamente para a nova playlist
      this.fecharModal(); // Fecha o modal
    }
  }

  excluirPlaylist(): void {
    if (this.playlists.length > 1) {
      this.playlists = this.playlists.filter(p => p !== this.playlistSelecionada);
      this.playlistSelecionada = this.playlists[0];
    } else {
      alert('Deve ter pelo menos uma playlist!');
    }
  }
}