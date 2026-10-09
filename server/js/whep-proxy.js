const http = require('http');

/*
 * Forwards /whep/* to MediaMTX so the browser can start WebRTC playback
 * through the dashboard's own origin. In development the CRA dev server does
 * this via client/src/setupProxy.js; in production this replaces it.
 */
function whepProxy(target) {
  const base = new URL(target);

  return (req, res) => {
    const upstream = http.request(
      {
        protocol: base.protocol,
        hostname: base.hostname,
        port: base.port,
        method: req.method,
        // Mounted at /whep, so req.url is already stripped of the prefix
        path: req.url,
        headers: { ...req.headers, host: base.host },
      },
      (upstreamRes) => {
        const headers = { ...upstreamRes.headers };
        // MediaMTX returns an absolute session path (e.g. /path/whep/<id>);
        // prefix it so the client's DELETE also goes through this proxy
        if (headers.location && headers.location.startsWith('/')) {
          headers.location = `/whep${headers.location}`;
        }
        res.writeHead(upstreamRes.statusCode, headers);
        upstreamRes.pipe(res);
      },
    );

    upstream.on('error', (err) => {
      console.error('WHEP proxy error:', err.code || err.message);
      if (!res.headersSent) res.status(502).send('Video server unavailable');
    });

    req.pipe(upstream);
  };
}

module.exports = whepProxy;
