import { Inject } from '@angular/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import { BlobService } from '@shared/services/blob/blob.service';
import { ThemeService } from '@shared/services/theme/theme.service';

/**
 * Provides a blob animation inside a Canvas.
 */
@Component({
	selector: 'app-blob',
	templateUrl: './blob.component.html',
	styleUrls: ['./blob.component.scss']
})
export class BlobComponent implements OnInit {

	@ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

	colors = new Map([
		['default', '#ebefff'],
		['dark', 'hsla(0,0%,100%,0.16)']
	]);

	wpPi = Math.PI * 2;
	halfPi = Math.PI / 2;

	radius = 700;
	segments = 12;
	step = this.halfPi / this.segments;
	anchors = [];
	radii = [];
	thetaOff = [];

	bumpRadius = 100;
	halfBumpRadius = this.bumpRadius / 2;

	theta = 0;
	thetaRamp = 0;
	thetaRampDest = 12;
	rampDamp = 25;

	private _color = '#ebefff';
	private _ctx: CanvasRenderingContext2D;

	constructor(
		private _ngZone: NgZone,
		@Inject(WINDOW) private readonly window: Window,
	) { }

	ngOnInit() {
		this._ctx = this.canvas.nativeElement.getContext('2d');

		this.createBlob();

		// run outside angular so that change detection doesn't trigger
		this._ngZone.runOutsideAngular(() => this.loop());

	}

	createBlob(): void {
		for (let i = 0; i < this.segments + 2; i++) {
			this.anchors.push(0, 0);
			this.radii.push(Math.random() * this.bumpRadius - this.halfBumpRadius);
			this.thetaOff.push(Math.random() * 2 * Math.PI);
		}
	}

	update() {
		this.thetaRamp += (this.thetaRampDest - this.thetaRamp) / this.rampDamp;
		this.theta += 0.03;

		this.anchors = [0, this.radius];
		for (let i = 0; i <= this.segments + 2; i++) {
			const sine = Math.sin(this.thetaOff[i] + this.theta + this.thetaRamp);
			const rad = this.radius + this.radii[i] * sine;
			const x = rad * Math.sin(this.step * i);
			const y = rad * Math.cos(this.step * i);
			this.anchors.push(x, y);
		}

		this._ctx.save();
		this._ctx.translate(-10, -10);
		this._ctx.scale(0.5, 0.5);
		this._ctx.fillStyle = this._color;
		this._ctx.beginPath();
		this._ctx.moveTo(0, 0);
		this.bezierSkin(this.anchors, false);

		this._ctx.lineTo(0, 0);
		this._ctx.fill();
		this._ctx.restore();
	}

	// array of xy coords, closed boolean
	bezierSkin(bez, closed = true): void {
		const avg = this.calcAvgs(bez);
		const leng = bez.length;

		if (closed) {
			this._ctx.moveTo(avg[0], avg[1]);
			for (let i = 2; i < leng; i += 2) {
				const n = i + 1;
				this._ctx.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
			}
			this._ctx.quadraticCurveTo(bez[0], bez[1], avg[0], avg[1]);
		} else {
			this._ctx.moveTo(bez[0], bez[1]);
			this._ctx.lineTo(avg[0], avg[1]);
			for (let i = 2; i < leng - 2; i += 2) {
				const n = i + 1;
				this._ctx.quadraticCurveTo(bez[i], bez[n], avg[i], avg[n]);
			}
			this._ctx.lineTo(bez[leng - 2], bez[leng - 1]);
		}
	}

	calcAvgs(p) {
		const avg = [];
		const leng = p.length;
		let prev;

		for (let i = 2; i < leng; i++) {
			prev = i - 2;
			avg.push((p[prev] + p[i]) / 2);
		}
		// close
		avg.push((p[0] + p[leng - 2]) / 2, (p[1] + p[leng - 1]) / 2);
		return avg;
	}

	loop() {
		this._ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
		this.update();
		this.window.requestAnimationFrame(() => this.loop());
	}

}
