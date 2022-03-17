import { WMStatus, WMStatusOnline } from 'types/data';

/**
 * Type guard for online state
 *
 * @param props Props
 * @returns guard
 */
export function isOnline(props: WMStatus): props is WMStatusOnline {
  return !!props.online;
}
export const roundNum = (num: number, precision: number) => {
  return `${Number.parseFloat(num.toString()).toFixed(precision)}`;
};
