import { AbstractControl, ValidatorFn } from "@angular/forms";

export function matchValues(matchTo: string): ValidatorFn{
    return(control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
}

export function isValidURL(url: string): boolean {
  const urlPattern = new RegExp(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/);
  return urlPattern.test(url);
}