#!/bin/ash

# Runs non-worker startup scripts (migrations, primarily)
if [ "$APP_ENV" != "worker" ]; then
/usr/local/bin/php /var/www/html/artisan package:discover
/usr/local/bin/php /var/www/html/artisan migrate --force
/usr/local/bin/php /var/www/html/artisan optimize
/usr/local/bin/php /var/www/html/artisan route:cache
/usr/local/bin/php /var/www/html/artisan queue:restart
fi

# Excludes migrations from worker startup
if [ "$APP_ENV" = "worker" ]; then
/usr/local/bin/php /var/www/html/artisan package:discover
/usr/local/bin/php /var/www/html/artisan optimize
/usr/local/bin/php /var/www/html/artisan route:cache
/usr/local/bin/php /var/www/html/artisan queue:restart
fi