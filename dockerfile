FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y locales language-pack-ja fonts-ipafont-gothic && \
    locale-gen ja_JP.UTF-8 && \
    update-locale LANG=ja_JP.UTF-8

ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

RUN apt update && \
    apt install -y \
    apache2 \
    php8.3 \
    php8.3-cli \
    php8.3-mysql \
    php8.3-opcache \
    libapache2-mod-php8.3 \
    mysql-client \
    wget curl git nano \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt update && apt install -y libcurl4-openssl-dev
RUN apt install php8.3-curl

RUN echo "alias mysql='mysql --default-character-set=utf8mb4'" >> ~/.bashrc

WORKDIR /var/www/html

RUN a2enmod rewrite

EXPOSE 80

RUN echo "<?php phpinfo(); ?>" > index.php

CMD ["apachectl", "-D", "FOREGROUND"]