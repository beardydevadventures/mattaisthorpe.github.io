---
id: 350
title: Create a Pull Request in GitHub
date: 2020-02-29T22:42:59+00:00
author: MatthewAisthorpe
excerpt: Going through the process of creating, viewing and merging pull requests.
layout: post
guid: https://matthewaisthorpe.com.au/?p=350
permalink: /create-a-pull-request-in-github/
categories:
  - Code
  - DevOps
---
A pull request is extremely useful when working in larger groups of teams or onboarding new developers as it allows the code changes to be viewed in an isolated environment before going into the main development branch. This is expanding more on the merge request section of [my previous post](https://matthewaisthorpe.com.au/git-branches-and-merge-requests/). 

<blockquote class="wp-block-quote">
  <p>
    Pull requests let you tell others about changes you&#8217;ve pushed to a GitHub repository. Once a pull request is sent, interested parties can review the set of changes, discuss potential modifications, and even push follow-up commits if necessary.
  </p>
  
  <cite>From GitHub&#8217;s <a href="https://help.github.com/articles/using-pull-requests">Using Pull Requests Page</a></cite>
</blockquote>

A pull requests allows the team to visualise and collaborate on the proposed changes to source code that exist as commits on a feature and isolated Git branch. 

## Creating a pull request

There are two main types of pull requests:

  1. Pull Request from a&nbsp;[forked repository](https://help.github.com/articles/fork-a-repo)
  2. Pull Request from a branch within a repository

This post we will be going over the process for number 2. 

### Create a Feature Branch

Before we create a pull request we will need to create a branch from the latest commit on master. This branch should sit under features within your repository with a name describing the change.

### Create a Pull Request

Go to the repository page on GitHub and click on &#8220;Pull Request&#8221; button in the repo header.<figure class="wp-block-image">

![Pull Request Button](https://f.cloud.github.com/assets/676185/316845/2ea7d418-9848-11e2-90af-5b8f31497a51.png) </figure> 

Pick the branch you wish to have merged using the &#8220;Head branch&#8221; dropdown. The rest of the fields should be fine, just make sure that the base repo and base branch are set correctly.

Enter a **title** and **description** for your pull request. You can use [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown) in the description for the pull request.

When you are done click on the &#8220;Send pull request&#8221; button to finish up and create the pull request.<figure class="wp-block-image">

![Send Pull Request](https://f.cloud.github.com/assets/676185/316876/30d6d0ca-984a-11e2-9c5e-420223c35ed9.png) </figure> 

### Reviewing a Pull Request

You can write comments related to a pull request if you find any issues or have queries about what it does.

Click on the &#8220;Commits&#8221; tab to view all the commits by all contained by a pull request.

Click on the &#8220;Files Changed&#8221; tab to see all the file changes to the proposed base branch from the pull request across all the commits.

You can event leave a comment on specific lines in the code change simply by hovering to the left of a line and clicking on the blue note icon.

### Merging a Pull Request

One your team is happy with the changes and there a no actionable comments you (or you senior developer/manager) can use GitHub&#8217;s &#8220;Merge pull request&#8221; button at the bottom of your pull request to merge your changes. If all goes well, you just have to add a commit message and click on &#8220;Confirm Merge&#8221; to merge the changes.<figure class="wp-block-image">

![Merge pull request button](https://f.cloud.github.com/assets/676185/316946/e8c42c4c-984e-11e2-8a09-5a977652028a.png) </figure> 

Note this button is only available when GitHub can detect that there will be no merge conflicts with the base branch. If there are merge conflicts, pull the base branch into your repository to resolve them.

### Closing a Pull Request

Simply click on the &#8220;Close&#8221; button on the pull request to close it. Optionally, you can delete the branch directly using the &#8220;Delete this branch&#8221; button. This is good practice to keep the code base clean.