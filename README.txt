n1puts.ru — установка
- index.html положить в /var/www/n1puts.ru/index.html
- изображения jpg/jpeg/png/gif/webp/avif класть в /var/www/n1puts.ru/memes/
- api-memes.php установить как /var/www/n1puts.ru/api/memes.php
- PHP должен исполняться веб-сервером для /api/memes.php; Caddy file_server сам PHP не запускает.
- Кликер использует /api/click.php: GET читает {"count":132}, POST увеличивает и возвращает актуальный count.
В интерфейсе только два блока: кликер и мемы. Визуал переработан под жёлто-чёрный вращающийся sunburst и CRT-сканлайны референса.
