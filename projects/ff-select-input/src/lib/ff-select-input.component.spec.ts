import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {FFSelectInputComponent} from './ff-select-input.component';
import {FFSelectInputService} from './ff-select-input.service';
import {FormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


@Component({
  template: `
    <div class="myBorders" #parent>
      <ff-select-input [disabled]="disabled" [value]="val1"
                       [options]="arr1"
                       [parentContainer]="parent"
                       (input)="log($event)"
      ></ff-select-input>
    </div>`,
  styles: [`.myBorders {
    height: 500px;
    border: 2px solid red;
    width: 500px;
    margin: 20px auto;
    position: relative;
  }`, `ff-select-input:last-child {
    position: absolute;
    bottom: 0;
    right: 0;
  }`]
})
class TestComponent {
  @ViewChild(FFSelectInputComponent, {static: true}) appComponentRef: FFSelectInputComponent;

  disabled: boolean = false;
  arr1 = [{value: 0, text: '1'},
    {value: 1, text: '2'},
    {value: 2, text: '3'},
    {value: 3, text: '4'}];
  val1 = 0;
  arr2 = [{value: null, text: 'Nothing selected'},
    {value: 'a', text: 'A'},
    {value: 'b', text: 'B'},
    {value: 'c', text: 'C'},
    {value: 'd', text: 'D'}];
  val2 = ['a', 'c'];

  log(e) {
    console.log(e);
  }
}


describe('FFPaginationComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let selectInputComponent: FFSelectInputComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, NoopAnimationsModule],
      declarations: [FFSelectInputComponent, TestComponent],
      providers: [FFSelectInputService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    selectInputComponent = fixture.debugElement.componentInstance.appComponentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create FFSelectInputComponent', () => {
    expect(selectInputComponent).toBeTruthy();
  });

//  todo add tests
});
