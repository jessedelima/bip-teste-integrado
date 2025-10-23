import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficioService } from '../../services/beneficio.service';
import { Beneficio } from '../../models/beneficio.model';

@Component({
  selector: 'app-beneficio-form',
  templateUrl: './beneficio-form.component.html',
  styleUrls: ['./beneficio-form.component.scss']
})
export class BeneficioFormComponent implements OnInit {
  beneficioForm: FormGroup;
  isEditMode = false;
  beneficioId?: number;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private beneficioService: BeneficioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.beneficioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.beneficioId = +id;
      this.loadBeneficio();
    }
  }

  loadBeneficio(): void {
    if (!this.beneficioId) return;

    this.loading = true;
    this.beneficioService.getBeneficioById(this.beneficioId).subscribe({
      next: (beneficio) => {
        this.beneficioForm.patchValue({
          nome: beneficio.nome,
          descricao: beneficio.descricao,
          valor: beneficio.valor,
          ativo: beneficio.ativo
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar benefício: ' + error;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.beneficioForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const beneficioData: Beneficio = this.beneficioForm.value;

    const operation = this.isEditMode
      ? this.beneficioService.updateBeneficio(this.beneficioId!, beneficioData)
      : this.beneficioService.createBeneficio(beneficioData);

    operation.subscribe({
      next: (beneficio) => {
        this.success = this.isEditMode 
          ? 'Benefício atualizado com sucesso!' 
          : 'Benefício criado com sucesso!';
        this.loading = false;
        
        // Redireciona após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/beneficios']);
        }, 2000);
      },
      error: (error) => {
        this.error = 'Erro ao salvar benefício: ' + error;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/beneficios']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.beneficioForm.controls).forEach(key => {
      const control = this.beneficioForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.beneficioForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} é obrigatório`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `${fieldName} deve ser maior que ${field.errors['min'].min}`;
      }
    }
    return '';
  }
}