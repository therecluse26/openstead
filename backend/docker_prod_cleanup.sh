#!/bin/ash
rm -R /root/.ssh/
apk del npm composer g++ autoconf make libtool build-base grep git libssh2-dev openssh-client
apk cache clean
rm -rf /var/cache/apk/*
rm  /var/www/html/*.yml
rm -rf /var/www/html/dev-scripts
rm -rf /var/www/html/scripts
rm -rf /var/www/html/docker
rm /var/www/html/docker_dev_ext.sh
rm -rf /tmp/*
