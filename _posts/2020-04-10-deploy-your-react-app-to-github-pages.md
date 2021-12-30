---
id: 404
title: Deploy your React App to GitHub Pages
date: 2020-04-10T07:56:54+00:00
author: MatthewAisthorpe
excerpt: Utilise free hosting provided by GitHub to host our static react web apps.
layout: post
guid: https://matthewaisthorpe.com.au/?p=404
permalink: /deploy-your-react-app-to-github-pages/
categories:
  - Code
  - DevOps
---
You have created an awesome react app and want to show to host is as a demo. GitHub provides us a free hosting to host our static web apps. Lets take full advantage of GitHub pages to convert your react code repository into a website.

## Step 1: Install the gh-pages package {#e6f8}

You will need to install the `gh-pages` package as a &#8220;dev-dependency&#8221; of the app. Go to the root of your app folder in the command line then enter:

<pre class="wp-block-code"><code>npm install gh-pages --save-dev</code></pre>

## Step 2: Add homepage property {#8a80}

Open your package.json file in your react app and add `homepage` property. Set the value to be the string `http://{username}.github.io/{repo-name}` where username is your GitHub username and repo-name is the name of your repository you want the page to be installed. For example my homepage url for my skill-tree repository would be:

<pre class="wp-block-code"><code>"homepage": "http://mattaisthorpe.github.io/skill-tree",</code></pre>

## Step 3: Create the Deploy script

Back in our package.json file we can add deploy script commands. In the existing `scripts` property, add a `predeploy` property and a `deploy` property, each having the follwoing values:

<pre class="wp-block-code"><code>  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"</code></pre>

For example my scripts looks like:

<pre class="wp-block-code"><code>  "scripts": {
    "start": "react-scripts start",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },</code></pre>

The `predeploy` command helps to bundle the react app for uploading while the `deploy` command uploads the bundled file to GitHub.

## Step 4: Deploy to GitHub Pages

Next, Generate a production build of your app: 

<pre class="wp-block-code"><code>npm run predeploy</code></pre>

and deploy it to GitHub Pages

<pre class="wp-block-code"><code>npm run deploy</code></pre>

## Step 5: Setup repository source to the gh-pages branch

Once your deploy script has successfully deployed, open your GitHub code repository and click on the settings tab. Scroll down to the GitHub Pages section and choose gh-pages as the source.<figure class="wp-block-image size-large">

<img loading="lazy" width="800" height="372" src="https://matthewaisthorpe.com.au/wp-content/uploads/2020/04/image.png" alt="" class="wp-image-406" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2020/04/image.png 800w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/04/image-300x140.png 300w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/04/image-768x357.png 768w" sizes="(max-width: 800px) 100vw, 800px" /> </figure> 

And you are done! Your site is now accessible at the URL you specified for \`homepage\` up in step 2.