import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EqualityService {
  deepEqual(a: any, b: any): boolean {
    if (a === b) {
      return true;
    }

    if (typeof a === 'string' && typeof b === 'string') {
      return a.trim() === b.trim();
    }

    // null, undefined and '' are equal
    if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) {
      return true;
    }

    // If one of arguments is null or undefined, they're not equal
    if (a === null || b === null || a === undefined || b === undefined) {
      return false;
    }

    // Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;

      // Sort arrays without mutation
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();

      for (let i = 0; i < sortedA.length; i++) {
        if (!this.deepEqual(sortedA[i], sortedB[i])) {
          return false;
        }
      }

      return true;
    }

    if (Array.isArray(a) !== Array.isArray(b)) {
      return false;
    }

    // Objects
    if (typeof a === 'object' && typeof b === 'object') {
      for (const key of Object.keys(a)) {
        const valueA = a[key];
        const valueB = b[key];

        // Check inner fields recursively
        if (!this.deepEqual(valueA, valueB)) {
          return false;
        }
      }

      return true;
    }

    return true;
  }

}
