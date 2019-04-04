import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

const modules = [
  CommonModule,
  MatCardModule,
  MatPaginatorModule,
  MatButtonModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class SharedModule { }
