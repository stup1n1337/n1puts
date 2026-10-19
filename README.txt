Исправления:
- Кликер: не меняй существующий reverse_proxy /api/click.php.
- Для мемов добавляй только блок из Caddyfile-addition.txt внутрь существующего сайта, ДО общего file_server.
- Соцблок больше не качается.
- На телефонах отключён double-tap zoom для кнопок, чтобы нажатия по кликеру не приближали страницу.

Структура:
  /var/www/n1puts.ru/index.html
  /var/www/n1puts.ru/memes/  (картинки)

После правки Caddy:
  caddy validate --config /etc/caddy/Caddyfile
  systemctl reload caddy
