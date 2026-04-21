# Étape 1 : Build du Front (React)
# Étape 1 : Build du Front
FROM node:22-alpine as build-stage
WORKDIR /app

# On copie uniquement les fichiers de dépendances d'abord
COPY package*.json ./

# On installe proprement (sans les fichiers locaux qui pourraient polluer)
RUN npm install

# On copie le reste du code
COPY . .

# Suppression préventive de dossiers qui pourraient causer des conflits de parsing
RUN rm -rf public/build bootstrap/cache/*.php

# On lance le build avec plus de mémoire allouée à Node
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

# Étape 2 : Configuration du Backend (PHP/Laravel)
FROM php:8.2-apache

# Installation des extensions PHP nécessaires pour Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev

RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Activation du module Apache Rewrite pour Laravel
RUN a2enmod rewrite

# Configuration du DocumentRoot d'Apache vers le dossier public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copie du code du projet
WORKDIR /var/www/html
COPY . .

# Copie du build React depuis l'étape 1
# Note : Laravel Vite met par défaut le build dans public/build
COPY --from=build-stage /app/public/build ./public/build

# Installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Permissions pour Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]