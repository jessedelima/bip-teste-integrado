import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-detail',
  templateUrl: './beneficio-detail.component.html',
  styleUrls: ['./beneficio-detail.component.scss']
})
export class BeneficioDetailComponent implements OnInit {
  beneficio?: Beneficio;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beneficioService: BeneficioService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBeneficio(+id);
    }
  }

  loadBeneficio(id: number): void {
    this.loading = true;
    this.error = '';

    this.beneficioService.getBeneficioById(id).subscribe({
      next: (beneficio) => {
        this.beneficio = beneficio;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar benefício: ' + error;
        this.loading = false;
      }
    });
  }

  editBeneficio(): void {
    if (this.beneficio?.id) {
      this.router.navigate(['/beneficios/editar', this.beneficio.id]);
    }
  }

  deleteBeneficio(): void {
    if (this.beneficio?.id && confirm(`Tem certeza que deseja excluir o benefício "${this.beneficio.nome}"?`)) {
      this.beneficioService.deleteBeneficio(this.beneficio.id).subscribe({
        next: () => {
          this.router.navigate(['/beneficios']);
        },
        error: (error) => {
          this.error = 'Erro ao excluir benefício: ' + error;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/beneficios']);
  }
}