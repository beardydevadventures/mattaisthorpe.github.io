---
id: 372
title: Creating a Progressive Web App (PWA)
date: 2020-03-07T00:01:58+00:00
author: MatthewAisthorpe
excerpt: How to turn a website into a PWA that can be downloaded to multiple devices.
layout: post
guid: https://matthewaisthorpe.com.au/?p=372
permalink: /creating-a-progressive-web-app-pwa/
categories:
  - Code
  - Design
---
A **progressive web application** (**PWA**) is an application built using common web languages HTML, CSS and JavaScript then delivered through web. A **PWA** is intended to work on any platform that uses a standards-compliant browser. The browser can install the **PWA** to the device like a native application. 

## Some benefits of using a PWA

  * **PWA allows to save time and money**, you only need to develop the application once rather than for each environment.
  * Save time updating your PWA since it is accessible from a web browser,** you don’t have to submit your application to the Stores**.
  * Users can **access the content much faster**, directly via a URL.
  * The Progressive Web App is a website at heart and is optimised for search engines. The latest algorithm developed by Google particularly values PWA. This means that a **PWA is likely to appear in the first search results and therefore to be well known by the users**.
  * **User can register the PWA in his/her favorites**. An icon appears on their devices home screen, same as for native applications.

## Supported Browsers

At the time of writing this article the following major browsers support **PWA**s.<figure class="wp-block-table">

<table class="">
  <tr>
    <th class="has-text-align-center" data-align="center">
      Chrome
    </th>
    
    <th class="has-text-align-center" data-align="center">
      Safari
    </th>
    
    <th class="has-text-align-center" data-align="center">
      Firefox
    </th>
    
    <th class="has-text-align-center" data-align="center">
      Edge
    </th>
  </tr>
  
  <tr>
    <td class="has-text-align-center" data-align="center">
      Supports (40)
    </td>
    
    <td class="has-text-align-center" data-align="center">
      Supports (11.1)
    </td>
    
    <td class="has-text-align-center" data-align="center">
      Supports (44)
    </td>
    
    <td class="has-text-align-center" data-align="center">
      Supports (17)
    </td>
  </tr>
</table></figure> 

## Creating a PWA

To set up your website to be **PWA** complaint there are a few new files required.

###  Set up the manifest

The **manifest.json** contains a few settings to tell the browser how to treat your PWA.

You can use <https://app-manifest.firebaseapp.com/> to build the **manifest.json** and icons requires 512&#215;512 image, put the generated files and folders in the root of your site.

Then add a link to the manifest.json in <head> tags.

<pre class="wp-block-code"><code>&lt;link rel="manifest" href="manifest.json"></code></pre>

There are some additional header tags required to be PWA compliant:

<pre class="wp-block-code"><code>&lt;meta name="viewport" content="width=device-width, initial-scale=1">
&lt;meta name="description" content="Description text of pwa.">
&lt;link rel="apple-touch-icon" href="/pwa-unity/images/icons/icon-192x192.png">
&lt;meta name="theme-color" content="red"></code></pre>

### Add a Service Worker

Create **service-worker.js** file in the root of your site. This file can be left blank for now. Then in your index.html add the below function to include the new **service-worker.js** file if the there is a **serviceWorker** in the browser.

<pre class="wp-block-code"><code>&lt;script>
    if ('serviceWorker' in navigator) {
			window.addEventListener('load', function() {
				navigator.serviceWorker.register('/pwa-unity/service-worker.js').then(function(registration) {
					// Registration was successful
					console.log('ServiceWorker registration successful with scope: ', registration.scope);
				}, function(err) {
					// registration failed :(
					console.log('ServiceWorker registration failed: ', err);
				});
			});
		}
    &lt;/script></code></pre>

Also it is worth adding a <noscript> line in <body> of your index page to show a warning message if the JavaScript is not running in the browser.

<pre class="wp-block-code"><code>&lt;noscript>Your need JavaScript enabled to enjoy this pwa!&lt;/noscript></code></pre>

### Add Lighthouse extension to Chrome

The Lighthouse extension is a tool that gives you a rating for your PWA, it will also highlight issues and give you suggestions on how to fix them.

<https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk>

Run the extension and check that app is working<figure class="wp-block-image size-large">

<img loading="lazy" width="1024" height="208" src="https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image-1024x208.png" alt="" class="wp-image-378" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image-1024x208.png 1024w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image-300x61.png 300w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image-768x156.png 768w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image-940x191.png 940w, https://matthewaisthorpe.com.au/wp-content/uploads/2020/03/image.png 1386w" sizes="(max-width: 1024px) 100vw, 1024px" /> </figure> 

### Offline capability

The true power of a PWA besides being able to be installed to multiple devices is the ability for offline functionality. This is controlled through the service-worker.js  
  
The below example of the service-worker.js is caching the index, js and css for the PWA so the files can be accessed if the application is offline.

<pre class="wp-block-code"><code>var cacheName = 'my-test-site';
var urlsToCache = &#91;
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});</code></pre>

## Testing the PWA

Upload the files to you server then navigate to the website using your phone browser. You should see a notification asking you to install the app to your device. To test the application offline functionality turn on flight mode on your device.