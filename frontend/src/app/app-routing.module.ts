import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';
import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form.component';
import { BeneficioDetailComponent } from './components/beneficio-detail/beneficio-detail.component';
import { TransferFormComponent } from './components/transfer-form/transfer-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/beneficios', pathMatch: 'full' },
  { path: 'beneficios', component: BeneficioListComponent },
  { path: 'beneficios/novo', component: BeneficioFormComponent },
  { path: 'beneficios/editar/:id', component: BeneficioFormComponent },
  { path: 'beneficios/:id', component: BeneficioDetailComponent },
  { path: 'transfer', component: TransferFormComponent },
  { path: '**', redirectTo: '/beneficios' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }