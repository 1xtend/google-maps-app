import { TestBed } from '@angular/core/testing';

import { EqualityService } from './equality.service';

fdescribe('EqualityService', () => {
  let service: EqualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EqualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for equal primitives', () => {
    expect(service.deepEqual(5, 5)).toBeTrue();
    expect(service.deepEqual('abc', 'abc')).toBeTrue();
    expect(service.deepEqual(true, true)).toBeTrue();
    expect(service.deepEqual(undefined, undefined)).toBeTrue();
  });

  it('should trim and compare strings', () => {
    expect(service.deepEqual('  test  ', 'test')).toBeTrue();
    expect(service.deepEqual('test', ' test ')).toBeTrue();
    expect(service.deepEqual('test', 'not test')).toBeFalse();
  });

  it('should treat null, undefined and empty string as equal', () => {
    expect(service.deepEqual(null, undefined)).toBeTrue();
    expect(service.deepEqual(undefined, '')).toBeTrue();
    expect(service.deepEqual(null, '')).toBeTrue();
  });

  it('should return false if only one value is null or undefined', () => {
    expect(service.deepEqual({}, null)).toBeFalse();
    expect(service.deepEqual([], undefined)).toBeFalse();
    expect(service.deepEqual('a', null)).toBeFalse();
  });

  it('should compare arrays deeply and ignore order', () => {
    expect(service.deepEqual([1, 2, 3], [3, 2, 1])).toBeTrue();
    expect(service.deepEqual(['a', 'b'], ['b', 'a'])).toBeTrue();
    expect(service.deepEqual([1, 2], [1, 2, 3])).toBeFalse();
    expect(service.deepEqual([1, 2, [3]], [[3], 2, 1])).toBeTrue();
  });

  it('should deeply compare objects', () => {
    expect(service.deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBeTrue();
    expect(service.deepEqual({ a: 1 }, { a: 2 })).toBeTrue();
    expect(service.deepEqual({ a: [1, 2] }, { a: [2, 1] })).toBeTrue();
  });

  it('should ignore missing keys in one object', () => {
    expect(service.deepEqual({ a: 1, b: 2 }, { a: 1 })).toBeFalse();
  });

  it('should compare nested objects and arrays', () => {
    const a = { x: [1, { y: 'hello' }], z: null };
    const b = { x: [{ y: 'hello' }, 1], z: undefined };
    expect(service.deepEqual(a, b)).toBeTrue();
  });
});
