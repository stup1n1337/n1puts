Автоматическое сканирование папки memes без JSON и PHP

1. index.html положить в /var/www/n1puts.ru/index.html
2. Все мемы класть прямо в /var/www/n1puts.ru/memes/
3. В Caddyfile включить directory browsing только для /memes/ (пример ниже).

Пример Caddyfile для сайта:

:80 {
    root * /var/www/n1puts.ru
    encode gzip

    @click_api path /api/click.php
    reverse_proxy @click_api 127.0.0.1:8765

    @memes_index path /memes/
    handle @memes_index {
        file_server browse
    }

    handle {
        file_server
    }
}

Если у тебя сайт обслуживается на другом адресе/порту или есть HTTPS-блок, сохрани текущую конфигурацию и добавь обработку /memes/ по примеру; не заменяй остальные важные маршруты вслепую.

Как работает:
- браузер запрашивает HTML-список /memes/, который Caddy создаёт автоматически;
- JavaScript выбирает случайное имя файла из ссылок на изображения;
- поддерживаются jpg/jpeg/png/gif/webp/avif/bmp;
- никакого JSON, PHP или ручного списка файлов.
После изменения конфигурации: `caddy validate --config /etc/caddy/Caddyfile`, затем `systemctl reload caddy`.

Важно: список файлов будет публично доступен по адресу https://n1puts.ru/memes/. Не клади в папку ничего, что не должно быть публичным.
