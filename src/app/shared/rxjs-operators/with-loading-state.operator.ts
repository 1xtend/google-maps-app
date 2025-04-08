import { catchError, map, Observable, of, OperatorFunction, startWith } from 'rxjs';

export interface LoadingState<T> {
  data: T | undefined;
  loading: boolean;
  error: any | undefined;
}

export function withLoadingState<T>(): OperatorFunction<T, LoadingState<T>> {
  return (source: Observable<T>): Observable<LoadingState<T>> => source.pipe(
    map((data): LoadingState<T> => ({ data, loading: false, error: undefined })),
    catchError((error) => of({ data: undefined, loading: false, error })),
    startWith({ data: undefined, loading: true, error: undefined })
  )
}
