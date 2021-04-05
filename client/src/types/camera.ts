import { Literal, Static, Union } from 'runtypes';

export const Device = Union(Literal('primary'), Literal('secondary'));

export type Device = Static<typeof Device>;
