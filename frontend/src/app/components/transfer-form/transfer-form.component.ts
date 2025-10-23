import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BeneficioService } from '../../services/beneficio.service';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss']
})
export class TransferFormComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private beneficioService: BeneficioService) {
    this.form = this.fb.group({
      fromId: [null, [Validators.required, Validators.min(1)]],
      toId: [null, [Validators.required, Validators.min(1)]],
      amount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.markTouched();
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';

    this.beneficioService.transferBeneficios(this.form.value).subscribe({
      next: () => {
        this.success = 'Transferência realizada com sucesso!';
        this.loading = false;
        this.form.reset({ amount: 0 });
      },
      error: (err) => {
        this.error = 'Erro ao realizar transferência: ' + err;
        this.loading = false;
      }
    });
  }

  private markTouched(): void {
    Object.keys(this.form.controls).forEach(key => this.form.get(key)?.markAsTouched());
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c || !c.errors || !c.touched) return '';
    if (c.errors['required']) return 'Campo obrigatório';
    if (c.errors['min']) return `Valor mínimo: ${c.errors['min'].min}`;
    return 'Valor inválido';
  }
}