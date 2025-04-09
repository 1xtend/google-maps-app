import { ComponentRef, inject, Injectable, Renderer2, ViewContainerRef } from '@angular/core';
import { Place } from '../models/place.interface';
import { PlaceTooltipComponent } from '../components/place-tooltip/place-tooltip.component';
import { filter, first, fromEvent, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { TooltipPlacement } from '../models/tooltip-placement.enum';
import { GoogleMap } from '@angular/google-maps';
import { SelectedMarkersService } from './selected-markers.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceTooltipService {
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private selectedMarkersService = inject(SelectedMarkersService);

  private tooltipRef: ComponentRef<PlaceTooltipComponent> | null = null;

  private documentMousedownSubscription: Subscription | null = null;
  private zoomChangeSubscription: Subscription | null = null;
  private windowResizeSubscription: Subscription | null = null;

  private subscriptions: Subscription[] = [];

  private readonly padding: number = 16;

  show(markerEl: HTMLElement, place: Place, googleMap: GoogleMap, e: PointerEvent): void {
    this.hide();

    const tooltip = this.viewContainerRef.createComponent(PlaceTooltipComponent);
    const tooltipEl: HTMLElement = tooltip.location.nativeElement;

    tooltip.setInput('place', place);
    this.selectedMarkersService.selectMarker(markerEl, place);
    this.setTooltipStyles(tooltipEl, 0, 0, 'hidden');

    setTimeout(() => {
      this.positionTooltip(tooltipEl, googleMap.googleMap?.getDiv() ?? this.document.body, e);
    }, 0);

    this.hideTooltipOnMouseDown(markerEl, tooltipEl);
    this.hideTooltipOnZoom(googleMap);
    this.hideTooltipOnWindowResize();

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
  }

  private hideTooltipOnMouseDown(markerEl: Node, tooltipEl: Node): void {
    this.documentMousedownSubscription = fromEvent(this.document, 'mousedown').pipe(
      filter((e) => {
        const target: Node | null = e.target as Node;
        const clickedOutsideTooltip: boolean = !tooltipEl.contains(target);
        const clickedOutsideMarker: boolean = !markerEl.contains(target);
        return clickedOutsideTooltip && clickedOutsideMarker;
      }),
      first()
    ).subscribe(() => {
      this.hide();
    });
    this.subscriptions.push(this.documentMousedownSubscription);
  }

  private hideTooltipOnZoom(googleMap: GoogleMap): void {
    this.zoomChangeSubscription = googleMap.zoomChanged.pipe(first()).subscribe(() => this.hide());
    this.subscriptions.push(this.zoomChangeSubscription);
  }

  private hideTooltipOnWindowResize(): void {
    this.windowResizeSubscription = fromEvent(window, 'resize').pipe(first()).subscribe(() => this.hide());
    this.subscriptions.push(this.windowResizeSubscription);
  }

  private positionTooltip(tooltipEl: HTMLElement, containerEl: HTMLElement, e: PointerEvent): void {
    const targetPos = { top: e.clientY, left: e.clientX };
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const placement: TooltipPlacement = this.getBestPlacement(targetPos, tooltipRect, containerRect);
    const position: { top: number, left: number } = this.calculatePosition(targetPos, tooltipRect, placement);
    const adjustedPosition: { top: number, left: number } = this.adjustPosition(position, tooltipRect, containerRect);

    this.setTooltipStyles(tooltipEl, adjustedPosition.top, adjustedPosition.left, 'visible');
  }

  private getBestPlacement(targetPos: {
    top: number,
    left: number
  }, tooltipRect: DOMRect, containerRect: DOMRect): TooltipPlacement {
    const spaceTop = targetPos.top - containerRect.top;
    const spaceRight = containerRect.right - targetPos.left;
    const spaceBottom = containerRect.bottom - targetPos.top;
    const spaceLeft = targetPos.left - containerRect.left;

    if (spaceTop >= tooltipRect.height + this.padding) {
      return TooltipPlacement.TOP;
    }

    const spaces = [
      { placement: TooltipPlacement.RIGHT, space: spaceRight - tooltipRect.width - this.padding },
      { placement: TooltipPlacement.BOTTOM, space: spaceBottom - tooltipRect.height - this.padding },
      { placement: TooltipPlacement.LEFT, space: spaceLeft - tooltipRect.width - this.padding }
    ];

    spaces.sort((a, b) => b.space - a.space);

    return spaces[0].space > 0 ? spaces[0].placement : TooltipPlacement.TOP;
  }

  private calculatePosition(targetPos: {
    top: number,
    left: number
  }, tooltipRect: DOMRect, placement: TooltipPlacement): { top: number, left: number } {
    switch (placement) {
      case TooltipPlacement.TOP: {
        return {
          top: targetPos.top - tooltipRect.height,
          left: targetPos.left - (tooltipRect.width / 2),
        }
      }
      case TooltipPlacement.RIGHT: {
        return {
          top: targetPos.top - (tooltipRect.height / 2),
          left: targetPos.left
        }
      }
      case TooltipPlacement.BOTTOM: {
        return {
          top: targetPos.top,
          left: targetPos.left - (tooltipRect.width / 2)
        }
      }
      case TooltipPlacement.LEFT: {
        return {
          top: targetPos.top - (tooltipRect.height / 2),
          left: targetPos.left - tooltipRect.width
        }
      }
    }
  }

  private adjustPosition(position: { top: number, left: number }, tooltipRect: DOMRect, containerRect: DOMRect): {
    top: number,
    left: number
  } {
    return {
      top: Math.max(
        containerRect.top + this.padding,
        Math.min(
          position.top,
          containerRect.bottom - tooltipRect.height - this.padding
        )
      ),
      left: Math.max(
        containerRect.left + this.padding,
        Math.min(
          position.left,
          containerRect.right - tooltipRect.width - this.padding
        )
      )
    }
  }

  private setTooltipStyles(tooltipEl: HTMLElement, top: number, left: number, visibility: 'hidden' | 'visible'): void {
    this.renderer.setStyle(tooltipEl, 'top', top > 0 ? `${ top }px` : top);
    this.renderer.setStyle(tooltipEl, 'left', left > 0 ? `${ left }px` : left);
    this.renderer.setStyle(tooltipEl, 'visibility', visibility);
  }
}
