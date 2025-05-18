import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LocalPage } from './local.page'; // Standalone component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalPage // ✅ Import the standalone component here
  ]
})
export class LocalPageModule {}