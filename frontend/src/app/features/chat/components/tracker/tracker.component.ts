import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnInit
} from '@angular/core';
import { tuiPure } from '@taiga-ui/cdk';

@Component({
	selector: 'app-tracker',
	templateUrl: './tracker.component.html',
	styleUrls: ['./tracker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackerComponent implements OnInit {
	@Input() nItems: number;
	@Input() activeItem: number;

	constructor(private el: ElementRef) {}

	ngOnInit() {}

	@tuiPure
	get size(): number {
	  return this._computeSize(this.nItems);
	}

	private _computeSize(nItems: number): number {
	  const height = this.el.nativeElement.offsetHeight;
	  return (height - 20) / nItems;
	}
}
