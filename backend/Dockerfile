FROM phpswoole/swoole:php8.0-alpine

ENV PHPIZE_DEPS \
    autoconf \
    cmake \
    file \
    g++ \
    gcc \
    libc-dev \
    pcre-dev \
    make \
    git \
    pkgconf \
    re2c \
    freetype-dev \
    libpng-dev  \
    libjpeg-turbo-dev \
    libxslt-dev \
    icu-dev \
    openssl-dev

RUN apk --no-cache add wget \
  coreutils \
  curl \
  openssh-client \
  libssh2-dev \
  git \
  icu-libs \
  grep \
  build-base \
  libmcrypt-dev \
  libxml2-dev \
  imagemagick-dev \
  pcre-dev \
  libtool \
  make \
  autoconf \
  g++ \
  cyrus-sasl-dev \
  libgsasl-dev \
  composer \
  supervisor \
  zip \
  libzip-dev \
  php8-zip \
  nfs-utils \
  nginx

RUN set -xe && ln -s /usr/lib /usr/local/lib64 \
    && apk add --virtual .build-deps \
        $PHPIZE_DEPS \
    && docker-php-ext-configure gd \
      --with-freetype=/usr/include/ \
      --with-jpeg=/usr/include/ \
    && docker-php-ext-configure bcmath --enable-bcmath \
    && docker-php-ext-configure intl --enable-intl \
    && docker-php-ext-configure pcntl --enable-pcntl \
    && docker-php-ext-configure pdo_mysql --with-pdo-mysql

RUN docker-php-ext-install  -j$(nproc) \
    mysqli \
    pdo \
    pdo_mysql \
    xml \
    dom \
    opcache \
    pcntl \
    tokenizer \
    bcmath \
    intl \
    sockets \
    xmlwriter \
    gd \
    bcmath \
    intl \
    pcntl \
    pdo_mysql \
    xsl \
    zip

RUN pecl channel-update pecl.php.net && pecl install imagick mcrypt-1.0.4 ssh2-1.3.1

RUN docker-php-ext-enable imagick mcrypt redis dom xml xmlwriter tokenizer

COPY --chown=www-data:www-data . /var/www/html/
COPY nginx/nginx_config.conf /etc/nginx/nginx.conf
COPY supervisord-app.conf /etc/supervisord.conf
COPY docker_startup.sh /root/docker_startup.sh
COPY docker_php_startup_scripts.sh /root/docker_php_startup_scripts.sh
COPY docker/php.ini-production /usr/local/etc/php/php.ini
COPY docker/php.ini-production /etc/php8/php.ini

RUN chmod +x /root/docker_startup.sh && chmod +x /var/www/html/docker_startup.sh && chmod +x /var/www/html/docker_prod_cleanup.sh && chmod +x /root/docker_php_startup_scripts.sh

RUN echo '*  *  *  *  *    cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1' > /etc/crontabs/root

ARG ENV

RUN mkdir -p /run/nginx

# Prevents certain composer packages from exceeding memory limit and failing to build
ENV COMPOSER_MEMORY_LIMIT=-1

# Points docker-compose at different file based on environment
RUN  cd /var/www/html && /usr/local/bin/php /usr/bin/composer.phar install --no-ansi --no-dev --no-interaction --no-plugins --no-progress --no-scripts --optimize-autoloader

RUN /var/www/html/docker_prod_cleanup.sh

ENTRYPOINT ["/var/www/html/docker_startup.sh"]