import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { ToastService } from '../../services/toast.service';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-list',
  templateUrl: './beneficio-list.component.html',
  styleUrls: ['./beneficio-list.component.scss']
})
export class BeneficioListComponent implements OnInit {
  beneficios: Beneficio[] = [];
  loading = false;

  constructor(
    private beneficioService: BeneficioService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.loading = true;
    
    this.beneficioService.getAllBeneficios().subscribe({
      next: (beneficios) => {
        this.beneficios = beneficios;
        this.loading = false;
      },
      error: (error) => {
        // O erro já será tratado pelo interceptor
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
          this.toast.showSuccess(`Benefício "${nome}" excluído com sucesso!`);
          this.loadBeneficios(); // Recarrega a lista
        },
        error: (error) => {
          // O erro já será tratado pelo interceptor
        }
      });
    }
  }

  createNew(): void {
    this.router.navigate(['/beneficios/novo']);
  }
}