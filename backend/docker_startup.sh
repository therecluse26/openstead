#!/bin/ash

/usr/local/bin/php /var/www/html/artisan package:discover
/usr/local/bin/php /var/www/html/artisan migrate --force
/usr/local/bin/php /var/www/html/artisan optimize
/usr/local/bin/php /var/www/html/artisan queue:restart

/usr/bin/supervisord -n -c /etc/supervisord.conf