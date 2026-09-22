import { Map } from 'react-leaflet';

// Leaflet 1.x removes its wheel listener without cancelling an already queued
// zoom. React-Leaflet unbinds unload events before removal, so clean up first.
export default class SessionMap extends Map {
  componentWillUnmount() {
    const wheel = this.leafletElement.scrollWheelZoom as {
      _timer?: ReturnType<typeof setTimeout>;
    };
    if (wheel && wheel._timer !== undefined) clearTimeout(wheel._timer);
    if (super.componentWillUnmount) super.componentWillUnmount();
  }
}
