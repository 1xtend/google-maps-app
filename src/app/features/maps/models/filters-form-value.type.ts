import { FiltersForm } from './filters-form.interface';
import { ExtractFormControlValue } from '../../../core/models/extract-form-control-value.type';

export type FiltersFormValue = {
  [K in keyof FiltersForm]: ExtractFormControlValue<FiltersForm[K]>
}
