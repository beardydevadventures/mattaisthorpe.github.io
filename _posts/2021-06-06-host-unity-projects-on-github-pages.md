---
id: 515
title: Host Unity projects on GitHub Pages
date: 2021-06-06T06:19:19+00:00
author: MatthewAisthorpe
excerpt: I am going to take you through the steps to host your own Unity project using Github Pages.
layout: post
guid: https://matthewaisthorpe.com.au/?p=515
permalink: /host-unity-projects-on-github-pages/
categories:
  - Hosting
---
Have you been working on [**Unity**](https://web.archive.org/web/20210204215626/https://unity3d.com/)&nbsp;projects and wanted a way to host your games for free so other people may experience them? With the use of [**GitHub**&nbsp;**Pages**](https://web.archive.org/web/20210204215626/https://pages.github.com/)&nbsp;makes this possible for you to host a build of your Unity project!

In this post I am going to provide you the steps to host your own Unity project using Github Pages.[](https://web.archive.org/web/20210204215626/https://medium.com/?source=post_page-----2ed6b4d9c324--------------------------------)<figure class="wp-block-image size-large">

<img loading="lazy" width="994" height="673" src="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/web_game.jpg" alt="" class="wp-image-527" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/web_game.jpg 994w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/web_game-300x203.jpg 300w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/web_game-768x520.jpg 768w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/web_game-940x636.jpg 940w" sizes="(max-width: 994px) 100vw, 994px" /> <figcaption>My Unity game hosted on GitHub pages for free!</figcaption></figure> 

## Create a WebGL build in Unity

<p id="2fc6">
  Unity has a build option available that allows you to create a build of your project that can be played in a browser.
</p>

<blockquote class="wp-block-quote">
  <p>
    The&nbsp;WebGL&nbsp;build option allows&nbsp;Unity&nbsp;to publish content as JavaScript programs which use HTML5 technologies and the&nbsp;WebGL&nbsp;rendering.
  </p>
</blockquote>

<p id="0214">
  Here are the steps to create a WebGL build:
</p>

  1. File > Build Settings > HTML5/WebGL.
  2. Install the module if you don’t already have it. This will require restarting Unity.
  3. Player settings > Set the resolution, check run in background, and choose a template.
  4. Click the **Build** button.<figure class="wp-block-image size-large">

<img loading="lazy" width="1024" height="746" src="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings-1024x746.jpg" alt="" class="wp-image-528" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings-1024x746.jpg 1024w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings-300x219.jpg 300w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings-768x559.jpg 768w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings-940x685.jpg 940w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/build-settings.jpg 1396w" sizes="(max-width: 1024px) 100vw, 1024px" /> <figcaption>Setting up the build in Unity.</figcaption></figure> 

<p id="fa71">
  This will create an <em>index.html</em> file and <em>Build/</em> directory. Depending on the template you chose, it may also create a <em>TemplateData/</em> directory. You should be able to point your browser at your local <em>index.html</em> and be able to play your build, next we are going to get the build up on GitHub.
</p>

## Push your WebGL Build to GitHub 

<p id="7202">
  Move <em>index.html</em>, <em>Build/</em>, and <em>TemplateData/</em> to the root of your git repository. Commit and push all of these files. Your build files will be accessible online in your GitHub repository, but it will only show the file contents of what is uploaded, while we want the content to be hosted.
</p>

If you haven&#8217;t used GitHub before I have created a tutorial on [how to create a repository](https://matthewaisthorpe.com.au/github-start-a-repository/).

## Set up GitHub Pages

<p id="a13d">
  Next up is GitHub Pages.
</p>

<blockquote class="wp-block-quote">
  <p>
    GitHub Pages is a static site hosting service designed to host your personal, organization, or project pages directly from a GitHub repository.
  </p>
</blockquote>

<p id="7944">
  To set this up in GitHub:
</p>

  1. Navigate to your repository > Settings > Pages.
  2. Set Source to master branch and Save.<figure class="wp-block-image size-large">

<img loading="lazy" width="1024" height="695" src="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github-1024x695.jpg" alt="" class="wp-image-529" srcset="https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github-1024x695.jpg 1024w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github-300x204.jpg 300w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github-768x522.jpg 768w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github-940x638.jpg 940w, https://matthewaisthorpe.com.au/wp-content/uploads/2021/06/github.jpg 1374w" sizes="(max-width: 1024px) 100vw, 1024px" /> </figure> 

<p id="e895">
  Navigate to <em>https://</em><strong><em><user-name-here></em></strong><em>.github.io/</em><strong><em><repo-name-here></em></strong> (mine is <a href="https://mattaisthorpe.github.io/sprite-unity-game/" data-type="URL" data-id="https://mattaisthorpe.github.io/sprite-unity-game/">https://mattaisthorpe.github.io/sprite-unity-game/</a>) and your game will load up. If you can&#8217;t access the page yet, give it five minutes then refresh.
</p>

<p id="92dd">
  There you have it! You have now uploaded a Unity build to GitHub and hosted on GitHub Pages. Here is one of my project setups to compare or check it out:
</p>

  * <a rel="noreferrer noopener" href="https://github.com/mattaisthorpe/sprite-unity-game" target="_blank">Sprite Game GitHub Repo</a>
  * <a rel="noreferrer noopener" href="https://mattaisthorpe.github.io/sprite-unity-game/" target="_blank">Sprite Game hosted on GitHub Pages</a>

<p id="e539">
  You can read more about my <a href="https://matthewaisthorpe.com.au/portfolio/2d-sprite-adventure/">sprite game</a> on my portfolio, I go through the objective of the project and what I got out of it. Thanks!
</p>