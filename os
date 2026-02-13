#!/usr/bin/env bash

# Modified fork of Laravel sail for Alpine-based projects
# Replaces app bash commands with Ash - Alpine Linux Shell

if ! [ -x "$(command -v docker-compose)" ]; then
    shopt -s expand_aliases
    alias docker-compose='docker compose'
fi

UNAMEOUT="$(uname -s)"

WHITE='\033[1;37m'
NC='\033[0m'
EXEC="yes"

# Verify operating system is supported...
case "${UNAMEOUT}" in
    Linux*)             MACHINE=linux;;
    Darwin*)            MACHINE=mac;;
    *)                  MACHINE="UNKNOWN"
esac

if [ "$MACHINE" == "UNKNOWN" ]; then
    echo "Unsupported operating system [$(uname -s)]. Laravel Sail supports macOS, Linux, and Windows (WSL2)." >&2

    exit 1
fi

# Source the ".env" file so Laravel's environment variables are available...
if [ -f ./.env ]; then
    source ./.env
fi

# Define environment variables...
export API_SERVICE=${API_SERVICE:-"openstead-api"}
export FRONTEND_SERVICE=${FRONTEND_SERVICE:-"openstead-frontend"}

if [ $# -gt 0 ]; then

    # Proxy PHP commands to the "php" binary on the application container...
    if [ "$1" == "php" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php "$@"

    elif [ "$1" == "up" ]; then
        ./os docker-login
        docker-compose up -d

    elif [ "$1" == "reload" ]; then
      ./os down && ./os up        

    elif [ "$1" == "build-api" ]; then
        ./os docker-login
        docker-compose build

    elif [ "$1" == "conf" ]; then
        ./os artisan config:cache

    elif [ "$1" == "config:cache" ]; then
        ./os artisan config:cache

    elif [ "$1" == "config:clear" ]; then
        ./os artisan config:clear

    elif [ "$1" == "cache:clear" ]; then
        ./os artisan cache:clear

    elif [ "$1" == "aws:login" ]; then

    	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 710021134758.dkr.ecr.us-east-1.amazonaws.com

    elif [ "$1" == "aws:conf" ]; then

        aws configure

    elif [ "$1" == "telescope:install" ]; then
        shift 1
        docker exec $(docker ps -aqf "name=$API_SERVICE") \
            /bin/ash -c "php artisan telescope:install" && ./os telescope:migrate

    elif [ "$1" == "telescope:migrate" ]; then
        shift 1
        docker exec $(docker ps -aqf "name=$API_SERVICE") \
            /bin/ash -c "php artisan migrate --path=vendor/laravel/telescope/database/migrations/2018_08_08_100000_create_telescope_entries_table.php"


    elif [ "$1" == "db:migrate" ]; then
        shift 1

        docker exec $(docker ps -aqf "name=$API_SERVICE") \
            /bin/ash -c "php artisan migrate"

    elif [ "$1" == "db:fresh-seed" ]; then
        shift 1

        docker exec $(docker ps -aqf "name=$API_SERVICE") \
            /bin/ash -c "php artisan migrate:fresh --seed"

    elif [ "$1" == "analyze" ]; then
            shift 1

            docker exec $(docker ps -aqf "name=$API_SERVICE") \
                /bin/ash -c "vendor/bin/phpstan analyze"

    elif [ "$1" == "insights" ]; then
        shift 1

        docker exec $(docker ps -aqf "name=$API_SERVICE") \
            /bin/ash -c "php artisan insights"

    elif [ "$1" == "docker-nuke" ]; then

        while true; do
                echo "
 __        ___    ____  _   _ ___ _   _  ____
 \ \      / / \  |  _ \| \ | |_ _| \ | |/ ___|
  \ \ /\ / / _ \ | |_) |  \| || ||  \| | |  _
   \ V  V / ___ \|  _ <| |\  || || |\  | |_| |
    \_/\_/_/   \_\_| \_\_| \_|___|_| \_|\____|
                                              "
                echo ""
                echo "This command will destroy all existing local docker assets (containers, images, volumes, networks, etc)"
                echo ""
                read -p "Are you sure? [y/n]: " yn
            case $yn in
                [Yy]* ) docker system prune --all -f --volumes; break;;
                [Nn]* ) exit;;
                * ) echo "Please answer yes or no.";;
            esac
        done


    # Proxy vendor binary commands on the application container...
    elif [ "$1" == "document" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php artisan scribe:generate


    # Proxy vendor binary commands on the application container...
    elif [ "$1" == "bin" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            ./vendor/bin/"$@"


    # Proxy Composer commands to the "composer" binary on the application container...
    elif [ "$1" == "composer" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            /usr/local/bin/php /usr/bin/composer.phar "$@"

    # Proxy Artisan commands to the "artisan" binary on the application container...
    elif [ "$1" == "artisan" ] || [ "$1" == "art" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php artisan "$@"

    # Proxy the "debug" command to the "php artisan" binary on the application container with xdebug enabled...
    elif [ "$1" == "debug" ]; then
        shift 1

        docker-compose exec \
            -e XDEBUG_SESSION=1 \
            "$API_SERVICE" \
            php artisan "$@"

    # Proxy the "test" command to the "php artisan test" Artisan command...
    elif [ "$1" == "test" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php artisan test "$@"

    # Proxy the "phpunit" command to "php vendor/bin/phpunit"...
    elif [ "$1" == "phpunit" ]; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php vendor/bin/phpunit "$@"

    # Proxy the "dusk" command to the "php artisan dusk" Artisan command...
    elif [ "$1" == "dusk" ]; then
        shift 1

        docker-compose exec \
            -e "APP_URL=http://${APP_SERVICE}" \
            -e "DUSK_DRIVER_URL=http://selenium:4444/wd/hub" \
            "$API_SERVICE" \
            php artisan dusk "$@"

    # Proxy the "dusk:fails" command to the "php artisan dusk:fails" Artisan command...
    elif [ "$1" == "dusk:fails" ]; then
        shift 1

        docker-compose exec \
            -e "APP_URL=http://${APP_SERVICE}" \
            -e "DUSK_DRIVER_URL=http://selenium:4444/wd/hub" \
            "$API_SERVICE" \
            php artisan dusk:fails "$@"

    # Initiate a Laravel Tinker session within the application container...
    elif [ "$1" == "tinker" ] ; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            php artisan tinker

     # Proxy NPM commands to the frontend container
    elif [ "$1" == "dev" ]; then
        shift 1

        npm --prefix ./frontend run dev

    # Proxy NPM commands to the frontend container
    elif [ "$1" == "npm" ]; then
        shift 1

        npm --prefix ./frontend "$@"

    # Proxy NPX commands to the "npx" binary on the application container...
    elif [ "$1" == "npx" ]; then
        shift 1

        docker-compose exec \
            "$FRONTEND_SERVICE" \
            npx --prefix ./frontend "$@"

    # Proxy YARN commands to the "yarn" binary on the application container...
    elif [ "$1" == "yarn" ]; then
        shift 1

        yarn --cwd ./frontend "$@"

    # Initiate a MySQL CLI terminal session within the "mysql" container...
    elif [ "$1" == "mysql" ]; then
        shift 1

        docker-compose exec \
            mysql \
            bash -c 'MYSQL_PWD=${MYSQL_PASSWORD} mysql -u ${MYSQL_USER} ${MYSQL_DATABASE}'

    # Initiate a MySQL CLI terminal session within the "mariadb" container...
    elif [ "$1" == "mariadb" ]; then
        shift 1

        docker-compose exec \
            mariadb \
            bash -c 'MYSQL_PWD=${MYSQL_PASSWORD} mysql -u ${MYSQL_USER} ${MYSQL_DATABASE}'

    # Initiate a PostgreSQL CLI terminal session within the "pgsql" container...
    elif [ "$1" == "psql" ]; then
        shift 1

        docker-compose exec \
            pgsql \
            bash -c 'PGPASSWORD=${PGPASSWORD} psql -U ${POSTGRES_USER} ${POSTGRES_DB}'

    # Initiate a Ash shell within the application container...
    elif [ "$1" == "backend-shell" ] || [ "$1" == "ash" ]; then
        shift 1

        docker exec -it --user www-data $(docker ps -aqf "name=$API_SERVICE") /bin/ash

    # Initiate a Ash shell within the application container...
    elif [ "$1" == "frontend-shell" ] || [ "$1" == "ash" ]; then
        shift 1

        docker exec -it --user www-data $(docker ps -aqf "name=$FRONTEND_SERVICE") /bin/ash

    # Initiate a root user Ash shell within the application container...
    elif [ "$1" == "root" ] ; then
        shift 1

        docker-compose exec \
            "$API_SERVICE" \
            /bin/ash "$@"

    # Initiate a Redis CLI terminal session within the "redis" container...
    elif [ "$1" == "redis" ] ; then
        shift 1

        docker-compose exec \
            redis \
            redis-cli

    # Pass unknown commands to the "docker-compose" binary...
    else
        docker-compose "$@"
    fi

else
    docker-compose ps
fi
