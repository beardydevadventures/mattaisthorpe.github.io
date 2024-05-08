---
title: Host Unity Projects on GitHub Pages
publishDate: 2021-06-06 00:00:00
img: /assets/posts/host-unity-github-pages.jpg
img_alt: The unity and github icons with a plus symbol in between.
description: Learn how to host your Unity projects for free on GitHub Pages, allowing others to experience your games directly in their browsers.
tags:
  - Unity
  - GitHub Pages
  - WebGL
---

## Host Unity Projects on GitHub Pages

Have you been working on Unity projects and wanted a way to host your games for free so other people may experience them? GitHub Pages makes this possible for you to host a build of your Unity project!

### Create a WebGL Build in Unity

Unity has a build option available that allows you to create a build of your project that can be played in a browser. The WebGL build option enables Unity to publish content as JavaScript programs using HTML5 technologies and WebGL rendering.

Here are the steps to create a WebGL build:

1. Go to *File > Build Settings > HTML5/WebGL*.
2. Install the module if you don’t already have it. This will require restarting Unity.
3. Under Player settings, set the resolution, check *run in background*, and choose a template.
4. Click the *Build* button.

This process will create an *index.html* file and a *Build/* directory. Depending on the template you chose, it may also create a *TemplateData/* directory. You should be able to point your browser at your local *index.html* and play your build.

### Push Your WebGL Build to GitHub

Next, move *index.html*, *Build/*, and *TemplateData/* to the root of your git repository. Commit and push all of these files. Your build files will now be accessible online in your GitHub repository.

### Set Up GitHub Pages

GitHub Pages is a static site hosting service designed to host your personal, organization, or project pages directly from a GitHub repository.

To set up GitHub Pages:

1. Navigate to your *repository > Settings > Pages*.
2. Set Source to master branch and Save.
3. Navigate to *https://<user-name-here>.github.io/<repo-name-here>* (mine is https://beardydevadventures.github.io/sprite-unity-game/) and your game will load up. 

Note: If you can't access the page yet, give it five minutes then refresh, usually it is just a waiting game.

### Conclusion

You have now uploaded a Unity build to GitHub and hosted it on GitHub Pages. Here is one of my project setups to compare or check it out:

- [Sprite Game GitHub Repo](https://github.com/beardydevadventures/sprite-unity-game)
- [Sprite Game hosted on GitHub Pages](https://beardydevadventures.github.io/sprite-unity-game/)

I hope this helped you host your game. You can read more about my sprite game on my portfolio, where I go through the objective of the project and what I got out of it. Thanks for reading!