import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Agendamento {
  id: string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  titulo: string;
}

interface ItemDia {
  data: Date;
  diaNumero: number;
  outroMes: boolean;
  eDomingo: boolean;
  selecionado: boolean;
  diaSemanaIndice: number;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {
  dataAtual: Date = new Date();
  dataSelecionada: Date = new Date();
  agendamentos: Agendamento[] = [];

  diasDaSemana: string[] = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Controle de Modais (Criar/Editar)
  modalAberto: boolean = false;
  modoEdicao: boolean = false;
  novoTitulo: string = 'Entrada';
  novaHora: string = '07:30';
  indexEdicao: number = 0;

  // Controle do Modal Excluir
  modalExcluirAberto: boolean = false;
  indexExcluir: number = 0;

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.carregarLocalStorage();
    if (this.agendamentos.length === 0) {
      this.agendamentos = [
        { id: '1', data: this.formatarChaveData(new Date()), horaInicio: '07:30', titulo: 'Entrada' },
        { id: '2', data: this.formatarChaveData(new Date()), horaInicio: '09:30', titulo: 'Recreio' },
        { id: '3', data: this.formatarChaveData(new Date()), horaInicio: '11:45', titulo: 'Saída' }
      ];
    }
  }

  voltar(): void {
    this.location.back();
  }

  get nomeMesAtual(): string {
    return this.meses[this.dataAtual.getMonth()];
  }

  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  get diaDaSemanaSelecionadoIndice(): number {
    return this.dataSelecionada.getDay();
  }

  formatarChaveData(date: Date): string {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  obterDiasDoMes(): ItemDia[] {
    const ano = this.dataAtual.getFullYear();
    const mes = this.dataAtual.getMonth();

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

    const selecionadoStr = this.formatarChaveData(this.dataSelecionada);
    const dias: ItemDia[] = [];

    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push({
        data: new Date(ano, mes, 0),
        diaNumero: 0,
        outroMes: true,
        eDomingo: false,
        selecionado: false,
        diaSemanaIndice: -1
      });
    }

    for (let dia = 1; dia <= totalDiasNoMes; dia++) {
      const dataObj = new Date(ano, mes, dia);
      const dataStr = this.formatarChaveData(dataObj);
      const eDomingo = dataObj.getDay() === 0;

      dias.push({
        data: dataObj,
        diaNumero: dia,
        outroMes: false,
        eDomingo,
        selecionado: dataStr === selecionadoStr,
        diaSemanaIndice: dataObj.getDay()
      });
    }

    return dias;
  }

  selecionarDia(item: ItemDia): void {
    if (item.outroMes) return;
    this.dataSelecionada = item.data;
  }

  get agendamentosDoDiaSelecionado(): Agendamento[] {
    const chave = this.formatarChaveData(this.dataSelecionada);
    return this.agendamentos
      .filter(a => a.data === chave)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  }

  // AÇÕES DOS MODAIS DE ADICIONAR E EDITAR
  abrirModalAdicionar(): void {
    this.modoEdicao = false;
    this.novoTitulo = 'Novo Sinal';
    this.novaHora = '08:00';
    this.modalAberto = true;
  }

  abrirModalEditar(): void {
    const doDia = this.agendamentosDoDiaSelecionado;
    if (doDia.length === 0) return;

    this.modoEdicao = true;
    this.indexEdicao = 0;
    this.atualizarCamposEdicao();
    this.modalAberto = true;
  }

  atualizarCamposEdicao(): void {
    const doDia = this.agendamentosDoDiaSelecionado;
    if (doDia[this.indexEdicao]) {
      this.novoTitulo = doDia[this.indexEdicao].titulo;
      this.novaHora = doDia[this.indexEdicao].horaInicio;
    }
  }

  salvarAgendamento(): void {
    const tituloFormatado = this.novoTitulo.trim() || 'Sinal';
    const chave = this.formatarChaveData(this.dataSelecionada);

    if (this.modoEdicao) {
      const itemParaEditar = this.agendamentosDoDiaSelecionado[this.indexEdicao];
      if (itemParaEditar) {
        itemParaEditar.titulo = tituloFormatado;
        itemParaEditar.horaInicio = this.novaHora;
      }
    } else {
      const novo: Agendamento = {
        id: Date.now().toString(),
        data: chave,
        horaInicio: this.novaHora,
        titulo: tituloFormatado
      };
      this.agendamentos.push(novo);
    }

    this.salvarLocalStorage();
    this.fecharModal();
  }

  // AÇÕES DO MODAL DE EXCLUIR
  abrirModalExcluir(): void {
    const doDia = this.agendamentosDoDiaSelecionado;
    if (doDia.length === 0) return;

    this.indexExcluir = 0;
    this.modalExcluirAberto = true;
  }

  confirmarExclusao(): void {
    const doDia = this.agendamentosDoDiaSelecionado;
    const itemParaExcluir = doDia[this.indexExcluir];

    if (itemParaExcluir) {
      this.agendamentos = this.agendamentos.filter(a => a.id !== itemParaExcluir.id);
      this.salvarLocalStorage();
    }

    this.fecharModal();
  }

  eliminarHorarioDireto(id: string): void {
    this.agendamentos = this.agendamentos.filter(a => a.id !== id);
    this.salvarLocalStorage();
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.modalExcluirAberto = false;
  }

  private carregarLocalStorage(): void {
    const dados = localStorage.getItem('sinal_escola_agendamentos');
    if (dados) {
      try {
        this.agendamentos = JSON.parse(dados);
      } catch {
        this.agendamentos = [];
      }
    }
  }

  private salvarLocalStorage(): void {
    localStorage.setItem('sinal_escola_agendamentos', JSON.stringify(this.agendamentos));
  }
}