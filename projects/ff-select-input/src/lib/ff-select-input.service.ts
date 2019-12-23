import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {from, fromEvent} from 'rxjs';
import {debounceTime, mergeMap} from 'rxjs/operators';
import {FFSelectInputComponent} from './ff-select-input.component';

@Injectable({
  providedIn: 'root'
})
export class FFSelectInputService {
  private clickSubscription;
  private positionSubscription;
  private renderer: Renderer2;
  private dropdown: FFSelectInputComponent;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private _getPosition() {
    if (this.dropdown.parentContainer) {
      const parentRect = this.dropdown.parentContainer.getBoundingClientRect();
      const elementRect = this.dropdown.el.nativeElement.getBoundingClientRect();
      // todo take a look at rect.Y
      const posY = (elementRect as any).y - (parentRect as any).y;
      const direction = parentRect.height / 2 < posY + elementRect.height / 2;
      this.dropdown.above = direction;
      this.dropdown.maxHeight = (!direction ? parentRect.height - (posY + elementRect.height) : posY) - 4;
    } else {
      this.dropdown.above = this.dropdown.el.nativeElement.getBoundingClientRect().bottom > window.innerHeight / 2;
      this.dropdown.maxHeight = null;
    }
  }

  private _clickHandler = (e) => {
    let node = (e.target as HTMLElement);
    // checking if target is not a part of this dropdown;
    while (node) {
      if (node === this.dropdown.dropdown.nativeElement) {
        return;
      } else {
        node = node.parentElement;
      }
    }
    this.dropdown.close();
  };

  public subscribe(dropdown: FFSelectInputComponent) {
    if (this.dropdown !== dropdown) {
      this.dropdown && this.dropdown.close();
      this.dropdown = dropdown;
      this._getPosition();
      this.clickSubscription = fromEvent(window, 'click').subscribe(this._clickHandler);
      this.positionSubscription = from(['resize', 'orientationchange', 'scroll']).pipe(debounceTime(50)).pipe(
        mergeMap((event) => fromEvent(window, event))).subscribe((e) => {
        this._getPosition();
      });
    }
  }

  public unsubscribe(dropdown: FFSelectInputComponent) {
    if (this.dropdown === dropdown) {
      this.positionSubscription.unsubscribe();
      this.clickSubscription.unsubscribe();
      this.dropdown = null;
    }
  }
}
