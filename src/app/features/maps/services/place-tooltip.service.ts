import { ComponentRef, inject, Injectable, Renderer2, ViewContainerRef } from '@angular/core';
import { Place } from '../models/place.interface';
import { PlaceTooltipComponent } from '../components/place-tooltip/place-tooltip.component';
import { filter, first, fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { TooltipPlacement } from '../models/tooltip-placement.enum';
import { GoogleMap } from '@angular/google-maps';
import { SelectedMarkersService } from './selected-markers.service';

interface Position {
  top: number;
  left: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceTooltipService {
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private selectedMarkersService = inject(SelectedMarkersService);

  private tooltipRef: ComponentRef<PlaceTooltipComponent> | null = null;

  private subscriptions: Subscription[] = [];

  private readonly padding: number = 16;
  private readonly offset: number = 6;

  show(markerEl: HTMLElement, place: Place, googleMap: GoogleMap): void {
    this.hide();

    const tooltip = this.viewContainerRef.createComponent(PlaceTooltipComponent);
    const tooltipEl: HTMLElement = tooltip.location.nativeElement;

    tooltip.setInput('place', place);
    this.selectedMarkersService.selectMarker(markerEl, place);
    this.setTooltipStyles(tooltipEl, 0, 0, 'hidden');

    setTimeout(() => {
      this.positionTooltip(markerEl, tooltipEl, googleMap.googleMap?.getDiv() ?? this.document.body);
    }, 0);

    this.setupEventListeners(markerEl, tooltipEl, googleMap);

    this.tooltipRef = tooltip;
  }

  hide(): void {
    if (!this.tooltipRef) {
      return;
    }

    this.tooltipRef.destroy();
    this.tooltipRef = null;

    this.selectedMarkersService.unselectMarker();

    this.cleanSubscriptions();
  }

  cleanSubscriptions(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private setupOutsideClickListener(markerEl: Node, tooltipEl: Node): void {
    const listener = (eventName: 'mousedown' | 'touchstart') => fromEvent(this.document, eventName).pipe(
      filter((e) => {
        const target: Node | null = e.target as Node;
        const clickedOutsideTooltip: boolean = !tooltipEl.contains(target);
        const clickedOutsideMarker: boolean = !markerEl.contains(target);
        return clickedOutsideTooltip && clickedOutsideMarker;
      }),
      first()
    ).subscribe(() => {
      this.hide();
    })

    this.subscriptions.push(listener('mousedown'));
    this.subscriptions.push(listener('touchstart'));
  }

  private setupZoomChangeListener(googleMap: GoogleMap): void {
    const subscription = googleMap.zoomChanged.pipe(first()).subscribe(() => this.hide());
    this.subscriptions.push(subscription);
  }

  private setupWindowResizeListener(): void {
    const subscription = fromEvent(window, 'resize').pipe(first()).subscribe(() => this.hide());
    this.subscriptions.push(subscription);
  }

  private positionTooltip(markerEl: HTMLElement, tooltipEl: HTMLElement, containerEl: HTMLElement): void {
    const markerRect = markerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const placement: TooltipPlacement = this.getBestPlacement(tooltipRect, markerRect, containerRect);
    const position: Position = this.calculatePosition(tooltipRect, markerRect, placement);
    const adjustedPosition: Position = this.adjustPosition(position, tooltipRect, containerRect);

    this.setTooltipStyles(tooltipEl, adjustedPosition.top, adjustedPosition.left, 'visible');
  }

  private getBestPlacement(tooltipRect: DOMRect, markerRect: DOMRect, containerRect: DOMRect): TooltipPlacement {
    const spaceTop = markerRect.top - containerRect.top;
    const spaceRight = containerRect.right - markerRect.right;
    const spaceBottom = containerRect.bottom - markerRect.bottom;
    const spaceLeft = markerRect.left - containerRect.left;

    const spaces = [
      { placement: TooltipPlacement.TOP, space: this.calculatePlacementSpace(spaceTop, tooltipRect.height) },
      { placement: TooltipPlacement.RIGHT, space: this.calculatePlacementSpace(spaceRight, tooltipRect.width) },
      { placement: TooltipPlacement.BOTTOM, space: this.calculatePlacementSpace(spaceBottom, tooltipRect.height) },
      { placement: TooltipPlacement.LEFT, space: this.calculatePlacementSpace(spaceLeft, tooltipRect.width) }
    ];

    spaces.sort((a, b) => b.space - a.space);

    return spaces[0].space > 0 ? spaces[0].placement : TooltipPlacement.TOP;
  }

  private calculatePlacementSpace(space: number, tooltipSize: number) {
    return space - tooltipSize - this.padding - this.offset;
  }

  private calculatePosition(tooltipRect: DOMRect, markerRect: DOMRect, placement: TooltipPlacement): Position {
    switch (placement) {
      case TooltipPlacement.TOP:
        return this.calculateTopPosition(tooltipRect, markerRect);
      case TooltipPlacement.RIGHT:
        return this.calculateRightPosition(tooltipRect, markerRect);
      case TooltipPlacement.BOTTOM:
        return this.calculateBottomPosition(tooltipRect, markerRect);
      case TooltipPlacement.LEFT:
        return this.calculateLeftPosition(tooltipRect, markerRect);
    }
  }

  private calculateTopPosition(tooltipRect: DOMRect, markerRect: DOMRect): Position {
    return {
      top: markerRect.top - tooltipRect.height - this.offset,
      left: this.calculateHorizontalCenter(tooltipRect, markerRect),
    };
  }

  private calculateBottomPosition(tooltipRect: DOMRect, markerRect: DOMRect): Position {
    return {
      top: markerRect.bottom + this.offset,
      left: this.calculateHorizontalCenter(tooltipRect, markerRect),
    };
  }

  private calculateLeftPosition(tooltipRect: DOMRect, markerRect: DOMRect): Position {
    return {
      top: this.calculateVerticalCenter(tooltipRect, markerRect),
      left: markerRect.left - tooltipRect.width - this.offset
    };
  }

  private calculateRightPosition(tooltipRect: DOMRect, markerRect: DOMRect): Position {
    return {
      top: this.calculateVerticalCenter(tooltipRect, markerRect),
      left: markerRect.right + this.offset
    };
  }

  private calculateHorizontalCenter(tooltipRect: DOMRect, markerRect: DOMRect): number {
    return markerRect.left + (markerRect.width / 2) - (tooltipRect.width / 2);
  }

  private calculateVerticalCenter(tooltipRect: DOMRect, markerRect: DOMRect): number {
    return markerRect.top + (markerRect.height / 2) - (tooltipRect.height / 2);
  }

  private adjustPosition(position: Position, tooltipRect: DOMRect, containerRect: DOMRect): Position {
    return {
      top: this.adjustVerticalPosition(position.top, containerRect, tooltipRect),
      left: this.adjustHorizontalPosition(position.left, containerRect, tooltipRect)
    };
  }

  private adjustVerticalPosition(top: number, containerRect: DOMRect, tooltipRect: DOMRect): number {
    const minTop = containerRect.top + this.padding;
    const maxTop = containerRect.bottom - tooltipRect.height - this.padding;
    return Math.max(minTop, Math.min(top, maxTop));
  }

  private adjustHorizontalPosition(left: number, containerRect: DOMRect, tooltipRect: DOMRect): number {
    const minLeft = containerRect.left + this.padding;
    const maxLeft = containerRect.right - tooltipRect.width - this.padding;
    return Math.max(minLeft, Math.min(left, maxLeft));
  }

  private setTooltipStyles(tooltipEl: HTMLElement, top: number, left: number, visibility: 'hidden' | 'visible'): void {
    this.renderer.setStyle(tooltipEl, 'top', top > 0 ? `${ top }px` : top);
    this.renderer.setStyle(tooltipEl, 'left', left > 0 ? `${ left }px` : left);
    this.renderer.setStyle(tooltipEl, 'visibility', visibility);
  }

  private setupEventListeners(markerEl: HTMLElement, tooltipEl: HTMLElement, googleMap: GoogleMap): void {
    this.setupOutsideClickListener(markerEl, tooltipEl);
    this.setupZoomChangeListener(googleMap);
    this.setupWindowResizeListener();
  }
}
