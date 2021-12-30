---
id: 217
title: Set up a LEMP Stack on AWS
date: 2019-12-07T07:30:47+00:00
author: MatthewAisthorpe
excerpt: Setting up a server with Ubuntu, Nginx, MySQL and PHP
layout: post
guid: https://matthewaisthorpe.com.au/?p=217
permalink: /set-up-a-lemp-stack-on-aws/
categories:
  - DevOps
tags:
  - DevOPs
  - LEMP
  - Server
---
This weekend, after almost 7 years of using a [HostGator](https://www.hostgator.com/) server, I moved to an [AWS Lightsail](https://aws.amazon.com/s/lp/epid1014-b/) server. I brought the Lightsail Ubuntu server for $3.50 US a month. Within that server I created a LEMP stack, this is a server with Ubuntu (Linux), Nginx (pronounced Engine-x), MySQL and PHP.

This is only going to be a quick blog I am more or less jotting down notes of the commands I ran to get the server up and running, hopefully I will get back to this post and flesh it out more for you.

## Setting up LEMP

These are the commands I ran on my linux server.

<pre class="wp-block-code"><code>#access server
ssh root@your_server_ip

#update package list
sudo apt-get update

#install nginx
sudo apt-get install nginx

#install mysql
sudo apt-get install mysql-server
sudo mysql_secure_installation

#set up root sql password
sudo mysql
> SELECT user,authentication_string,plugin,host FROM mysql.user;
> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
> FLUSH PRIVILEGES;
> exit

#Note: for accessing mysql after password setup use this
mysql -u root -p

#install php
sudo apt-get install php-fpm php-mysql

#set up site config (use config_example.txt below)
sudo nano /etc/nginx/sites-available/example.com

#symbolic link site
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

#test nginx config
sudo nginx -t

#reload nginx
sudo systemctl reload nginx

#test php
sudo nano /var/www/html/info.php
&lt;?php phpinfo(); ?>
Go to address http://your_server_domain_or_IP/info.php
sudo rm /var/www/html/info.php

#set owner of html to user not root (for smtp purposes)
chown -R username /var/www/html</code></pre>

#### Nginx Config Example

<pre class="wp-block-code"><code>server {
        listen 80;
        root /var/www/html;
        index index.php index.html index.htm index.nginx-debian.html;
        server_name example.com;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }
}</code></pre>

You should be able to navigate to you servers public ip and see the default nginx screen. That means all this effort above worked!

## Add SSL with Let&#8217;s Encrypt

Using the Let&#8217;s Encrypt client, set up certbot to download SSL certificates for my domain. Create Nginx snippets to avoid duplicating code and configured Nginx to use the certificates. 

<pre class="wp-block-code"><code>#Install certbot
sudo apt update
sudo apt install certbot

#generate strong Dh (Diffie-Hellman) group
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

#map all HTTP requests for certs to a single directory
mkdir -p /var/lib/letsencrypt/.well-known
chgrp username /var/lib/letsencrypt
chmod g+s /var/lib/letsencrypt

#edit letsencrypt.conf (contents below)
sudo nano /etc/nginx/snippets/letsencrypt.conf

#edit ssl.conf (contents below)
#enables OCSP Stapling and enforces few security‑focused HTTP headers
sudo nano /etc/nginx/snippets/ssl.conf

#edit site config (contents below)
sudo nano /etc/nginx/sites-available/example.com

#restart nginx 
sudo systemctl restart nginx

#generate the certificates (should get a success message)
sudo certbot certonly --agree-tos --email admin@example.com --webroot -w /var/lib/letsencrypt/ -d example.com -d www.example.com

#update the site config to force ssl (contents below)
sudo nano /etc/nginx/sites-available/example.com

#restart nginx for changes to take effect
sudo systemctl reload nginx</code></pre>

#### /etc/nginx/snippets/letsencrypt.conf

<pre class="wp-block-code"><code>location ^~ /.well-known/acme-challenge/ {
  allow all;
  root /var/lib/letsencrypt/;
  default_type "text/plain";
  try_files $uri =404;
}</code></pre>

#### /etc/nginx/snippets/ssl.conf

<pre class="wp-block-code"><code>ssl_dhparam /etc/ssl/certs/dhparam.pem;

ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_session_tickets off;

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
ssl_prefer_server_ciphers on;

ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 30s;

add_header Strict-Transport-Security "max-age=15768000; includeSubdomains; preload";
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;</code></pre>

#### /etc/nginx/sites-available/example.com

<pre class="wp-block-code"><code>server {
        listen 80;
        root /var/www/html;
        index index.php index.html index.htm index.nginx-debian.html;
        server_name example.com;

        #Add include to encrypt.conf
        include snippets/letsencrypt.conf;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }
}</code></pre>

#### /etc/nginx/sites-available/example.com now with forced ssl

<pre class="wp-block-code"><code>server {
        listen 80;
        server_name www.example.com example.com;

        include snippets/letsencrypt.conf;
        return 301 https://$host$request_uri;
}

server {
        listen 443 ssl http2;
        server_name www.example.com;

        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
        include snippets/ssl.conf;
        include snippets/letsencrypt.conf;

        return 301 https://example.com$request_uri;
}

server {
        listen 443 ssl http2;
        server_name example.com;

        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
        include snippets/ssl.conf;
        include snippets/letsencrypt.conf;

        location / {
                try_files $uri $uri/ =404;
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }

        location ~ /\.ht {
                deny all;
        }
}</code></pre>

## Auto update SSL Certs

Set up a certbot cronjob for automatic certificate renewal.

<pre class="wp-block-code"><code>#edit the certbot cron (contents below)
sudo nano /etc/cron.d/certbot

#test certbot cron
sudo certbot renew --dry-run</code></pre>

#### /etc/cron.d/certbot

<pre class="wp-block-code"><code>0 */12 * * * root test -x /usr/bin/certbot -a \! -d /run/systemd/system && perl -e 'sleep int(rand(3600))' && certbot -q renew --renew-hook "systemctl reload nginx"</code></pre>

## What&#8217;s next?

Once the server was set up [I am planning to move over my wordpress sites located on hostgator over to the new server](https://matthewaisthorpe.com.au/wordpress-on-aws-lemp/). 

If you find this post and I haven&#8217;t fleshed it out yet I did find these tutorials helpful:

  * <https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04>
  * <https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04>
  * <https://linuxize.com/post/creating-a-self-signed-ssl-certificate/>
  * <https://linuxize.com/post/secure-nginx-with-let-s-encrypt-on-ubuntu-18-04/>