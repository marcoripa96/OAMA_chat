import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlobComponent } from './blob.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [BlobComponent],
	exports: [BlobComponent]
})
export class BlobModule { }
