---
id: 234
title: Move WordPress site to AWS LEMP
date: 2019-12-07T09:20:08+00:00
author: MatthewAisthorpe
excerpt: The steps I went through to move my Wordpress sites between servers.
layout: post
guid: https://matthewaisthorpe.com.au/?p=234
permalink: /wordpress-on-aws-lemp/
categories:
  - Code
  - DevOps
---
Following on from my previous post, these are the config and steps I took to download my WordPress sites from the Hostgator server and uploading them to the new AWS server I set up. Like my previous post I am more or less noting my steps, I may flesh it out later.

Following on from my previous post, these are the config and steps I took to download my WordPress sites from the Hostgator server and uploading them to the new AWS server I set up. Like my previous post I am more or less noting my steps, I may flesh it out later.

  1. First I downloaded the WordPress directory folder from the Hostgator server to my local machine.

  2. While the directory was downloading I did MySQL export of the WordPress database to my machine as well.

  3. Connecting to my new AWS server with SFTP I uploaded the WordPress directory to var/www/html/.

  4. Then used MySQLWorkbench to connect to the MySQL on the QWS server and create a new schema and upload the MySQL export.

  5. Once the files were uploaded using my editor I changed the database credentials in wp-config.php

  6. Then I ssh into my server and created a new nginx config for my wordpress sites. (Example of the wordpress config is below)

  7. Restarted nginx

  8. Then I changed the namespace on my DNS (Currently CrazyDomains) to point to AWS.

  9. Waited a millenia for the DNS to update the IP’s (around 3 hours) then checked to make sure my urls were pointing to my server.

 10. Set up the ssl certs for each url and added them to the config.
 11. Check that the urls worked and the sites were functioning correctly.

#### WORDPRESS CONFIG

<pre class="wp-block-code"><code># Redirect HTTP -&gt; HTTPS
server {
    listen 80;
    server_name www.example.com example.com;

    include snippets/letsencrypt.conf;
    return 301 https://example.com$request_uri;
}

# Redirect WWW -&gt; NON WWW
server {
    listen 443 ssl http2;
    server_name www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    include snippets/ssl.conf;

    return 301 https://example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    root /var/www/html/example.com;
    index index.php;

    # SSL parameters
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    include snippets/ssl.conf;
    include snippets/letsencrypt.conf;

    # log files
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.2-fpm.sock;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires max;
        log_not_found off;
    }

    location ~ /\.ht {
        deny all;
    }

}</code></pre>

Right now playing around with the sites I feel there are still some file permissions that I still need to set up correctly. Also the cache needs to be optimised when one site was on it was loading fast 600ms but when I threw in the second site everything slowed down.

## Folder Permissions

**Note:** Update “/path/to/your/wordpress/install/“ with your wordpress site directory path. 

<pre class="wp-block-code"><code>chown -R www-data:www-data /path/to/your/wordpress/install/</code></pre>

Run this command to fix all folder permissions in the wordpress directory.

<pre class="wp-block-code"><code>find /path/to/your/wordpress/install/ -type d -exec chmod 755 {} \;</code></pre>

And Fix all file permissions in the wordpress directory.

<pre class="wp-block-code"><code>find /path/to/your/wordpress/install/ -type f -exec chmod 644 {} \; </code></pre>

Change the permissions for the wp-config.php file .

<pre class="wp-block-code"><code>chmod 600 wp-config.php</code></pre>

Use the .htaccess permissions WordPress recommends with this command.

<pre class="wp-block-code"><code>chmod 600 .htaccess</code></pre>