/**
 * @property {string} name Pretty name
 * @property {string} path Route path
 * @property {boolean} exact Match this exact route but not children
 * @property {import('react').Component} component React component to render
 */
export interface RouteInfo {
    name: string,
    path: string,
    exact: boolean,
    component: React.Component
}
