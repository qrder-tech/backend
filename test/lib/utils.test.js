import { v4 as uuid } from 'uuid';
import { formatArguments, generateJwtToken, getUuidFromToken, reduceUserDetails, removeEmptyKeys } from '../../src/lib/utils';

test('Encode & Decode JWT', () => {
  const fakeUuid = uuid();
  const fakeToken = generateJwtToken(fakeUuid);

  expect(getUuidFromToken(fakeToken)).toBe(fakeUuid);
});

test('Reduce User Details', () => {
  const blacklist = ['password'];

  const fakeUser = {
    username: "fakeUsername",
    password: "fakePassword"
  };

  expect(Object.keys(reduceUserDetails(fakeUser)).filter(key => blacklist.includes(key)).length).toBe(0);
});

test('Remove Empty Keys', () => {
  const fakeObj = {
    a: '',
    b: ' ',
    c: null,
    d: undefined,
    e: false,
    f: true,
    g: 0,
    h: 1
  };

  const expectedObj = {
    a: '',
    b: ' ',
    e: false,
    f: true,
    g: 0,
    h: 1
  };

  expect(removeEmptyKeys(fakeObj)).toStrictEqual(expectedObj);
});

test('Format Arguments', () => {
  const fakeObj = {
    a: '',
    b: ' ',
    c: null,
    d: undefined
  };

  const expectedObj = {
    a: null,
    b: null,
    c: null,
    d: null
  };

  expect(formatArguments(fakeObj)).toStrictEqual(expectedObj);
});