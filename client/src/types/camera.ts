import { Literal, Static, Union, Number } from 'runtypes';

export const Device = Union(Literal('primary'), Literal('secondary'));

export type Device = Static<typeof Device>;

/* --------------------------------------- Payload Types --------------------------------------- */

export const Battery = Number;

export type Battery = Static<typeof Battery>;
