import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-menu-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select-menu-input.component.html',
  styleUrl: './select-menu-input.component.css'
})
export class SelectMenuInputComponent implements ControlValueAccessor{
  label = input.required<string>();
  options = input.required<string[]>();

  constructor(@Self() public ngControl: NgControl){
    this.ngControl.valueAccessor = this;
  }
  
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  get control(): FormControl{
    return this.ngControl.control as FormControl;
  }
}
