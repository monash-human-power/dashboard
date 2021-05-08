import { WMStatusOffline, WMStatusOnline } from 'types/data';

/**
 * Type guard for online state
 *
 * @param props Props
 * @returns guard
 */
export function isOnline(
  props: WMStatusOffline | WMStatusOnline,
): props is WMStatusOnline {
  return !!props.online;
}
