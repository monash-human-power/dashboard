export type BoostConfigType = 'powerPlan' | 'rider' | 'bike' | 'track' | 'all';

export interface BoostConfig {
  /** The input of BOOST that this config is for */
  type: BoostConfigType;
  /** List of available BOOST configuration files */
  options: string[];
  /** Currently selected BOOST configuration */
  active?: string;
}
