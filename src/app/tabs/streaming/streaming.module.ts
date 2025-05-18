import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StreamingPage } from './streaming.page'; // Standalone component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamingPage // ✅ Import the standalone component here
  ]
})
export class StreamingPageModule {}