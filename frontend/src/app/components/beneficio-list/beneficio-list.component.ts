import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.scss']
})
export class BeneficioListComponent implements OnInit {
  beneficios: Beneficio[] = [];
  loading = false;
  error = '';

  constructor(
    private beneficioService: BeneficioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.loading = true;
    this.error = '';
    
    this.beneficioService.getAllBeneficios().subscribe({
      next: (beneficios) => {
        this.beneficios = beneficios;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar benefícios: ' + error;
        this.loading = false;
      }
    });
  }

  viewBeneficio(id: number): void {
    this.router.navigate(['/beneficios', id]);
  }

  editBeneficio(id: number): void {
    this.router.navigate(['/beneficios/editar', id]);
  }

  deleteBeneficio(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir o benefício "${nome}"?`)) {
      this.beneficioService.deleteBeneficio(id).subscribe({
        next: () => {
          this.loadBeneficios(); // Recarrega a lista
        },
        error: (error) => {
          this.error = 'Erro ao excluir benefício: ' + error;
        }
      });
    }
  }

  createNew(): void {
    this.router.navigate(['/beneficios/novo']);
  }
}