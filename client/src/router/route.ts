export interface RouteInfo {
  /** Pretty name */
  name: string;
  /** Route path */
  path: string;
  /** Match this exact route but not children */
  exact: boolean;
  /** React component to render */
  component: React.Component;
}
