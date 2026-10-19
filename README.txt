n1puts.ru

index.html — главная страница.
memes/ — положите сюда jpg/jpeg/png/gif/webp/avif.
api-memes.php нужно установить как /var/www/n1puts.ru/api/memes.php.
Для PHP endpoint необходим PHP-FPM/fastcgi: Caddy file_server сам по себе PHP не исполняет.
Кликер использует /api/click.php: GET читает JSON {"count":132}, POST увеличивает счётчик.
Соцсети и анимации включены в index.html.
