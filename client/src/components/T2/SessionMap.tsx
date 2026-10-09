import { Map } from 'react-leaflet';

// Leaflet 1.x removes its wheel listener without cancelling an already queued
// zoom. React-Leaflet unbinds unload events before removal, so clean up first.
export default class SessionMap extends Map {
  private resizeObserver?: ResizeObserver;

  componentDidMount() {
    if (super.componentDidMount) super.componentDidMount();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.leafletElement.invalidateSize({ animate: false, pan: false });
      });
      this.resizeObserver.observe(this.leafletElement.getContainer());
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    const wheel = this.leafletElement.scrollWheelZoom as {
      _timer?: ReturnType<typeof setTimeout>;
    };
    // eslint-disable-next-line no-underscore-dangle
    if (wheel && wheel._timer !== undefined) clearTimeout(wheel._timer);
    if (super.componentWillUnmount) super.componentWillUnmount();
  }
}
