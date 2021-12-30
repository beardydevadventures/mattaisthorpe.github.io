---
id: 257
title: Docker Toolbox Environment
date: 2019-12-14T23:13:39+00:00
author: MatthewAisthorpe
excerpt: 'Setting up a local Docker environment '
layout: post
guid: https://matthewaisthorpe.com.au/?p=257
permalink: /docker-toolbox-environment/
categories:
  - DevOps
---
**Docker** is an **container** based platform tool, this is allows developers to run applications in a copy of the live environment. Docker uses an **image** to create a **container** to run the application in. A **container** is not persistent, any changes made within them are gone when the **container** is closed, to save our changes a **container** we can use a **volume**. 

## Getting Docker installed

Since I have Windows 10 Home I am using their legacy solution [Docker toolbox](https://docs.docker.com/toolbox/) if you have Mac or Windows 10 pro or higher you can use [Docker Desktop.](https://www.docker.com/products/developer-tools) 

To get started, first download and install&nbsp;[Docker Toolbox](https://www.docker.com/docker-toolbox).

The Toolbox installer will install VirtualBox, Docker Engine, Docker Machine, Docker Compose and Kitematic.

After the installer has run there will be two shortcuts on your desktop:&nbsp;**Kitematic**&nbsp;and&nbsp;**Docker Quickstart Terminal**.

Open **Docker Quickstart Terminal**. It will start a VirtualBox VM running Docker Engine, then configure the command-line environment so that you can talk to it. <figure class="wp-block-image size-large">

<img loading="lazy" width="578" height="215" src="https://matthewaisthorpe.com.au/wp-content/uploads/2019/12/docker-whale.jpg" alt="" class="wp-image-285" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2019/12/docker-whale.jpg 578w, https://matthewaisthorpe.com.au/wp-content/uploads/2019/12/docker-whale-300x112.jpg 300w" sizes="(max-width: 578px) 100vw, 578px" /> </figure> 

## Docker commands

To make sure docker is installed correctly run in the terminal:

<pre class="wp-block-code"><code>docker run hello-world</code></pre>

Since we don&#8217;t have the hello-world image on our system docker will go and pull it down to our local system then run it. After it has downloaded and run you should see &#8220;Hello from Docker!&#8221; followed by a further description of what has just happened.

To see the docker container running you started type the following command:

<pre class="wp-block-code"><code>docker ps -a</code></pre>

This will give you a list of your current docker containers and information on their status.

To give your docker container a unique name you can pass the `--name` parameter:

<pre class="wp-block-code"><code>docker run --name my-hello-world hello-world</code></pre>

Now if you run `docker -ps a` you will see two containers. The one we ran originally and the one with your new name.

To see all the images on docker run the following command:

<pre class="wp-block-code"><code>docker images</code></pre>

To remove a container from docker run the following command:

<pre class="wp-block-code"><code>docker rm my-hello-world</code></pre>

**Bonus** to remove all containers from docker you can run the following:

<pre class="wp-block-code"><code>docker rm $(docker ps -a -f status=exited -q)</code></pre>

You can always refer to&nbsp;`run --help`&nbsp;to get all the details for the syntax. 

## Ubuntu Container

Now let&#8217;s take what we have learned and start up a ubuntu container. This image is available on <https://hub.docker.com/> this will go an pull down the docker ubuntu image.

<pre class="wp-block-code"><code>docker run -it --name my-linux-container ubuntu bash</code></pre>

After the image is downloaded and running using the bash at the end of the command automatically puts you in the container to run commands.

You can exit the container by typing:

<pre class="wp-block-code"><code>exit</code></pre>

## Volumes

Let&#8217;s make a container that actually refers to some local files. This can be done with the&nbsp;`-v`&nbsp;flag. The notation would be

<pre class="wp-block-code"><code>-v [local/path]:[container/path]</code></pre>

The following code is written for my machine:

<pre class="wp-block-code"><code>docker run -it --name my-ubuntu-container --rm -v /c/Users/Documents/code:/my-code ubuntu bash</code></pre>

Then you can execute the following line (since you are on the environment) to see the files:

<pre class="wp-block-code"><code>ls my-code/</code></pre>

What we have done is taken all the content within the directory /c/Users/Documents/code and loaded it into the directory /my-code of the docker container.

**Be careful!** Your container now has actual files from your hard drive. So if you remove a file from the container it will be removed on your system as well without asking permission. It is a much better idea to only link the sub folder that you intend to use in your application.

## Finding your Docker IP

To access your docker toolbox environment you will need the ip address, you can find the address by running this command in the terminal.

<pre class="wp-block-code"><code>docker-machine ip default</code></pre>

## Docker Compose

I have created a docker compose example at <https://github.com/mattyace/lemp-docker> 

Pull the repo to your machine then navigate into the file using the command line then run the following command:

<pre class="wp-block-code"><code>docker-compose up -d</code></pre>

This will show the following code.

<pre class="wp-block-code"><code>$ docker-compose up -d
Creating network "lemp-docker_lemp-network" with driver "bridge"
Creating Matts_LEMP_php     ... done                                                                                                                                       Creating Matts_LEMP_mariadb ... done                                                                                                                                       Creating Matts_LEMP_nginx   ... done </code></pre>

If you navigate to you localhost (or if you are using docker toolbox the ip address of the toolbox) you should now see a &#8220;Welcome to Nginx&#8221; page. If you navigate to /index.php you will see a &#8220;Welcome fo Matty&#8217;s LEMP Docker Environment!&#8221; with php details.

If you are feeling adventurous you can access the database of the mysql instance with username **root** and password **masterpass** on port **3306**.

You can close these new containers with `docker-compose down`

Feel free to have a play with the setup of the containers and how the docker-compose file is set up. If you want to change details of the containers you can edit the .env file.