import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemoComponent } from './demo.component';

import { AuthGuard } from '@app/guards';

const routes: Routes = [
    {
      path: '',
      component: DemoComponent,
      children: [
        {
          path: 'controles',
          loadChildren: () => import('./pages/controles/controles.module').then(m=>m.ControlesModule)
        },
        {
          path: 'shared',
          loadChildren: () => import('./pages/shared/shared.module').then(m=>m.SharedModule)
        },
        {
          path: 'guards',
          loadChildren: () => import('./pages/guards/guards.module').then(m=>m.GuardsModule),
         // canLoad: [AuthGuard]
        }
      ]
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule { }
