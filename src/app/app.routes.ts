import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';

export const routes: Routes = [
  /*{
    path: '',
    component: HomePage,
  },*/
  {
    path: '',
    component: BarcodeScannerComponent,
  },
  {
    path: 'barcode-scanner',
    component: BarcodeScannerComponent,
  },
];
