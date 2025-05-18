import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'local',
        loadChildren: () => import('./local/local.module').then(m => m.LocalPageModule)
      },
      {
        path: 'streaming',
        loadChildren: () => import('./streaming/streaming.module').then(m => m.StreamingPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/local',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
