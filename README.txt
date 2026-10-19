n1puts.ru — static frontend + PHP endpoint for meme list

FILES
- index.html: page frontend
- api-memes.php: put this at /var/www/n1puts.ru/api/memes.php
- memes/: put your .jpg/.jpeg/.png/.gif/.webp/.avif images here

INSTALL
1. Upload index.html to /var/www/n1puts.ru/index.html
2. Create /var/www/n1puts.ru/api/ and upload api-memes.php there as memes.php
3. Put meme images in /var/www/n1puts.ru/memes/
4. Keep your existing /api/click.php endpoint.

CLICK API CONTRACT
The frontend reads GET /api/click.php and expects JSON like {"count":132}.
On each click it sends POST /api/click.php and expects the updated count in the same format.
The PHP endpoint must increment the shared total atomically on POST and return the updated count.
The provided example response confirms the JSON shape, but does not establish whether POST is currently supported; if it only supports GET, the endpoint needs a small POST increment handler.

CADDY
Your existing Caddy config can stay as-is. It already proxies /api/click.php to 127.0.0.1:8765. The /api/memes.php endpoint should be served by PHP-FPM or your current PHP handler. If PHP is not configured in Caddy, add an appropriate PHP-FPM handler for that endpoint; do not expose the raw PHP file as static text.
