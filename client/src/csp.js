module.exports = {
    dev: {
        "default-src": ["'self'"],
        "style-src": ["*", "'insafe-inline'"]
    },
    prod: {
        "default-src": "'self'",
        "style-src": "'self'",
        "img-src": ["'self'", "https://favicon.grovider.co"],
        "object-src": ["'self'", "https://*.grovider.co"],
        "connect-src": [ "'self'", "https://mybackend.com"]
    }
}
// JANICK !!!!! bitte >> cd client && npm install <<