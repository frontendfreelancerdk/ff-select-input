import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';

import {slideInOut} from './ff-select-input.animanitons';
import {FFSelectInputService} from './ff-select-input.service';

export interface FFOptionsListInterface {
  text: string | number;
  value: string | number | boolean;
}

@Component({
  selector: 'ff-select-input',
  templateUrl: './ff-select-input.component.html',
  styleUrls: ['./ff-select-input.component.scss'],
  animations: [slideInOut]
})
export class FFSelectInputComponent implements OnDestroy {
  private _dirty = false;
  private _touched = false;
  private _open = false;
  public _animationState = 'initial';
  public animated = false;
  public above = false;
  public isMobile: boolean;
  public defaultDisplay: FFOptionsListInterface[];
  public activeDisplay: FFOptionsListInterface[] = [];

  private _maxHeight = null;
  get maxHeight() {
    return this._maxHeight;
  }

  set maxHeight(val) {
    this._maxHeight = val;
  }

  @ViewChild('list', {static: true}) listEl: ElementRef<HTMLUListElement>;
  @ViewChild('dropdown', {static: true}) dropdown: ElementRef<HTMLDivElement>;

  @Input() multiSelect: boolean = false;
  private _parentContainer: HTMLElement;
  get parentContainer() {
    return this._parentContainer;
  }

  @Input() set parentContainer(val) {
    this._parentContainer = val;
  }

  private _defaultValue: string | number | boolean;
  get defaultValue() {
    return this._defaultValue;
  }

  @Input() set defaultValue(val) {
    this._defaultValue = val;
  }

  private _disabled: boolean = false;
  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set disabled(val: boolean) {
    this._disabled = val;
    if (this.disabled && this._open) {
      this.close();
    }
  }

  private _options: FFOptionsListInterface[] = [];
  get options() {
    return this._options;
  }

  @Input() set options(val: FFOptionsListInterface[]) {
    if (!Array.isArray(val)) {
      return;
    }
    if (this.multiSelect && typeof this.defaultValue !== 'undefined') {
      this._options = val.filter((e) => {
        if (e.value === this.defaultValue) {
          this.defaultDisplay = [e];
          return false;
        }
        return true;
      });
    } else {
      this._options = val;
    }
    this._setActiveDisplay();
  }

  private _value: string | number | boolean | (string | number | boolean)[];
  get value() {
    return this._value;
  }

  @Input() set value(val) {
    this._value = val;
    this._setActiveDisplay();
  }

  @Output() changed: EventEmitter<string | number | boolean | (string | number | boolean)[]> = new EventEmitter();
  @Output() input: EventEmitter<string | number | boolean | (string | number | boolean)[]> = new EventEmitter();

  constructor(public el: ElementRef, private cdRef: ChangeDetectorRef, private service: FFSelectInputService, private renderer: Renderer2) {
    this.isMobile = ('ontouchstart' in window);
  }

  private getActiveValues() {
    const result = [];
    if (this.activeDisplay.length) {
      for (let i = 0, len = this.activeDisplay.length; i < len; i++) {
        result.push(this.activeDisplay[i].value);
      }
    } else {
      result.push(this.defaultValue);
    }
    return result;
  }

  private isDirty() {
    if (!this._arrayComparison(this.value, this.getActiveValues())) {
      this.setDirty();
      return true;
    }
  }

  public onSelected() {
    if (this.isDirty()) {
      this.changed.emit(this._prepareValue());
    }
  }

  private _prepareValue() {
    const result = this.getActiveValues();
    return this.multiSelect ? typeof this.value === 'number' ? result.reduce((a, b) => a + b) : result : result[0];
  }

  private _setActiveDisplay() {
    if (this.value !== undefined && this.options) {
      if (this.multiSelect && typeof this.value === 'number') {
        if (this.value === 0) {
          this.activeDisplay = [];
        } else {
          const activeDisplay = [];
          const maskArr = this.arrayFromMask(this.value);
          for (let i = 0, len = maskArr.length; i < len; i++) {
            if (maskArr[i]) {
              activeDisplay.push(this.options[i]);
            }
          }
          this.activeDisplay = activeDisplay;
        }
      } else {
        this.activeDisplay = this.options.filter((e) => {
          if (this.multiSelect && Array.isArray(this.value)) {
            for (let i = 0, len = this.value.length; i < len; i++) {
              if (e.value === this.value[i]) {
                return e;
              }
            }
          } else {
            if (e.value === this.value) {
              return e;
            }
          }
        });
        if (!this.activeDisplay.length) {
          this.activeDisplay = [this.options[0]];
        }
      }
    }
  }

  _animationStart() {
    this.animated = true;
    this._doCheck();
  }

  _animationDone() {
    this.animated = false;
    this._doCheck();
  }

  setDirty() {
    if (!this._dirty) {
      this._dirty = true;
      this.renderer.addClass(this.el.nativeElement, 'ng-dirty');
    }
  }

  setTouched() {
    if (!this._touched) {
      this._touched = true;
      this.renderer.addClass(this.el.nativeElement, 'ng-touched');

    }
  }

  public toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  public close() {
    this._open = false;
    this.onSelected();
    if (!this.isMobile) {
      this._animationState = 'hidden';
      this.service.unsubscribe(this);
    }
  }

  public isOpen() {
    return !this.animated && this._animationState === 'visible';
  }

  public open() {
    this.setTouched();
    this._open = true;
    if (this.isMobile) {
      return;
    } else {
      this.service.subscribe(this);
      this._animationState = 'visible';
    }
  }

  _onItemClick(option: FFOptionsListInterface) {
    if (this.multiSelect) {
      if (this._indexOf(this.activeDisplay, option) === -1) {
        this.activeDisplay.push(option);
      } else {
        this.activeDisplay.splice(this._indexOf(this.activeDisplay, option), 1);
      }
    } else {
      this.activeDisplay = [option];
      this.close();
    }
    this.input.emit(this._prepareValue());
    this.isDirty();
  }

  _isListItemActive(option) {
    return this._indexOf(this.activeDisplay, option) !== -1;
  }

  private _indexOf(arr, option: FFOptionsListInterface) {
    if (Array.isArray(arr) && option) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i].value === option.value && arr[i].text === option.text) {
          return i;
        }
      }
      return -1;
    }
  }

  private _doCheck() {
    if (!this.cdRef['destroyed']) {
      this.cdRef.detectChanges();
    }
  }

  public getActiveTextValue() {
    if (!this.activeDisplay.length && !this.defaultDisplay) {
      return '';
    }
    const arr = this.activeDisplay.length ? this.activeDisplay : this.defaultDisplay;
    const textArr = arr.map((e) => {
      return e.text;
    });
    return textArr.length > 1 ? textArr.join(', ') : textArr;
  }

  // we assume that the values will be unique
  private _arrayComparison(arr1, arr2) {
    if (!Array.isArray(arr1)) {
      arr1 = [arr1];
    }
    if (arr1.length !== arr2.length) {
      return false;
    }
    let counter = 0;
    for (const item1 of arr1) {
      for (const item2 of arr2) {
        if (item1 === item2) {
          counter++;
          break;
        }
      }
    }
    return counter === arr1.length;
  }

  ngOnDestroy(): void {
    this.service.unsubscribe(this);
  }

  private arrayFromMask(nMask) {
    if (nMask > 0x7fffffff || nMask < -0x80000000) {
      throw new TypeError('arrayFromMask - out of range');
    }
    let nShifted = nMask;
    const aFromMask = [];
    for (; nShifted;
      // tslint:disable-next-line:no-bitwise
           aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1) {
    }
    return aFromMask;
  }
}
