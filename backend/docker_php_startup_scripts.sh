#!/bin/ash

# Runs non-worker startup scripts (migrations, primarily)
if [ "$APP_ENV" != "worker" ]; then
php artisan package:discover
php artisan migrate --force
php artisan optimize
php artisan route:cache
php artisan queue:restart
fi

# Excludes migrations from worker startup
if [ "$APP_ENV" = "worker" ]; then
php artisan package:discover
php artisan optimize
php artisan route:cache
php artisan queue:restart
fi