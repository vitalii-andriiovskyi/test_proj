import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

const modules = [
  CommonModule,
  MatCardModule,
  MatPaginatorModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class SharedModule { }
