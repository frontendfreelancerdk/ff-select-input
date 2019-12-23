[![Build Status](https://travis-ci.org/frontendfreelancerdk/ff-select-input.svg?branch=master)](https://travis-ci.org/frontendfreelancerdk/ff-select-input)

# ff-select-input

##Getting started

### Installation

#####To install this library, run:

```bash
$ npm install ff-select-input --save
```

##### Include to your module
 `app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
// Import library
import { FFSelectInputModule } from 'ff-select-input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Specify library as an import
    FFSelectInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once ff-select-input is imported, you can use its component in your Angular application:

```html
<!-- Now you can use library component in your.component.html
     Put your options array to [options] property. It's required.   
     Options array should match to 
interface FFOptionsListInterface {
  text: string | number;
  value: string | number | boolean;
} 
-->
<ff-select-input [options]="[{value: 0, text: '1'},
                 {value: 1, text: '2'},
                 {value: 2, text: '3'},
                 {value: 3, text: '4'}]">
</ff-select-input>
```

## API

Selector: `ff-select-input`  

#### Properties


```typescript
interface FFOptionsListInterface {
  text: string | number;
  value: string | number | boolean;
}

  @Input() options: FFOptionsListInterface[];
```
>  The [options] attribute is required attribute. You should put here array of your options. 
> !IMPORTANT make sure that your options match to FFOptionsListInterface;

```typescript
  @Input() multiSelect: boolean = false;
```
> The [multiSelect] attribute let you use multi select.

```typescript
  @Input() parentContainer: HTMLElement;
```
>  The [parentContainer] attribute sets max height and position of drop-list regarding parent element.
>Example: <div class="myWrapper" #wrapper>
>           <ff-select-input [options]=[...] [parentContainer]="wrapper">
>         </ff-select-input>

```typescript
  @Input() disabled: boolean = false;
```
>  If [disabled] is true - component adds css class "disabled" and disabled this input

```typescript
  @Input() value: string | number | boolean | (string | number | boolean)[];
```
> The [value] attribute sets current value. 
> It can be string, number or boolean type and for multi select - arrays of these types.

```typescript
  @Input() defaultValue: string | number | boolean;
```
> The [defaultValue] attribute works only with multi select. 
> Users will see this value when all options are unchecked. 

```typescript
  @Output() input: EventEmitter<string | number | boolean | (string | number | boolean)[]>;
```
> Event triggered when user selects any option.


## Example

`app.component.html`
```html
<div class="myBorders" #parent>
<!-- Simple select -->
  <ff-select-input [disabled]="disabled" [value]="0"
                   [options]="[{value: 0, text: '1'},
                   {value: 1, text: '2'},
                   {value: 2, text: '3'},
                   {value: 3, text: '4'}]"
                   [parentContainer]="parent"
  ></ff-select-input>
<!-- Multiple select -->
  <ff-select-input [value]="['a','c']" (input)="log($event)" [multiSelect]="true"
                   [defaultValue]="'x'"
<!-- ! Note that OPTION with value equals to defaultValue will be dropped from options list -->
<!-- User will see this option value in select only when nothing selected-->
                   [options]="[{value: 'x', text: 'Nothing selected'},
                               {value: 'a', text: 'A'},
                               {value: 'b', text: 'B'},
                               {value: 'c', text: 'C'},
                               {value: 'd', text: 'D'}]"
                   [parentContainer]="parent"
  ></ff-select-input>
</div>

```

`app.component.css`
```css
.myBorders {
  height: 500px;
  border: 2px solid red;
  width: 500px;
  margin: 20px auto;
  position: relative;
}
  ff-select-input:last-child {
    position: absolute;
    bottom: 0;
    right: 0;
  }

```

`app.component.ts`
```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'ff-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  disabled: boolean = false;

  log(e) {
    console.log(e);
  }
}

```
## License

MIT © [Frontend Freelancer](mailto:developer@frontend-freelancer.com)
