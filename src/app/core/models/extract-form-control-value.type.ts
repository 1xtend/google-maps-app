import { FormControl } from '@angular/forms';

export type ExtractFormControlValue<T> = T extends FormControl<infer U> ? U : never;
