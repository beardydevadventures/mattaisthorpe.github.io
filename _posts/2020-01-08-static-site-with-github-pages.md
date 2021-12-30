---
id: 292
title: Static site with GitHub Pages
date: 2020-01-08T13:01:35+00:00
author: MatthewAisthorpe
excerpt: 'Set up a static site using GitHub Pages. '
layout: post
guid: https://matthewaisthorpe.com.au/?p=292
permalink: /static-site-with-github-pages/
categories:
  - Code
  - Project Management
---
Want to get a static site up quick without paying for hosting? **GitHub Pages** allows you to host directly from your GitHub repository. First thing you should do, if you haven&#8217;t already, is go and create an account with [GitHub](https://github.com/) also I recommend downloading the [GitHub desktop app](https://desktop.github.com/). 

**Note:** You only get one site per GitHub account, this sets up a unique domain for you page.

  1. To start you need to [create a new repository](https://github.com/new) named  _username_.github.io, where _username_ is your username on GitHub. 
  2. Navigate into your new repository and click the _Set up in Desktop_ button. Your Github Desktop app will open and you can save the repository to your computer.
  3. Now we create an _index.html_ file in the repository similar to one we made in [HTML Basics](https://matthewaisthorpe.com.au/html-basics/). I have also put a html snippet below for you to copy into your _index.html_.
  4. Commit the _index.html_ and publish your file/s to your repository.
  5. You should be set! Navigate to **https://_username_.github.io** to see your new site.

### HTML Snippet

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
    &lt;body>
        &lt;h1>Hello World!&lt;/h1>
        &lt;p>This is &#91;your-name] web page! I am hosting with GitHub Pages.&lt;/p>
    &lt;/body>
&lt;/html></code></pre>