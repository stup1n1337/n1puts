Мемы без PHP

1. Залей index.html в /var/www/n1puts.ru/index.html
2. Залей memes.json в /var/www/n1puts.ru/memes/memes.json
3. Картинки положи в /var/www/n1puts.ru/memes/
4. В memes.json перечисли имена файлов, например:
[
  "meme1.jpg",
  "meme2.png",
  "meme3.gif"
]

При добавлении или удалении картинки обновляй список в memes.json. Это обычный статический JSON, PHP и изменение Caddy не нужны. Кликер по-прежнему использует существующий /api/click.php.
