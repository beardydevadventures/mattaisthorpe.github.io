---
id: 299
title: GitHub start a Repository
date: 2020-01-17T09:53:23+00:00
author: MatthewAisthorpe
excerpt: Setting up your first Git Repo and pushing it up to GitHub.
layout: post
guid: https://matthewaisthorpe.com.au/?p=299
permalink: /github-start-a-repository/
categories:
  - DevOps
---
When writing my last post about setting up a [Static Site using GitHub Pages](https://matthewaisthorpe.com.au/static-site-with-github-pages/) I realised I haven&#8217;t covered what GitHub is or what makes it so special (apart from hosting sites for free). I am here to go into more detail about GitHub so you have a better understanding.

## What is GitHub?

GitHub is a system used for Version control, allowing the management of changes and also store revisions of projects as they are being developed. The core that GitHub is built on is Git, an open source project started by&nbsp;Linux creator Linus Torvalds. 

GitHub is a Git repository hosting service, but it adds many quality of life features. Git is a command line tool while GitHub is an online system. It also allows users to set access control and collaboration features like descriptions and task management tools.

## How do I start?

  1. First thing you will want to do is [sign up for a Github account](https://github.com/join). 
  2. Once you have an account set up, install a git on your machine. We are going to be using the CLI (Command Line Interface) for this example.
  3. To confirm that your git is installed open a terminal window and type `git --version`.

## Create a new repo

Create a new repo (repository) for tracking the code changes within your project. 

  1. Create a directory for the project. 
  2. Go into the new directory.
  3. Type `git init`
  4. Create a file and write some code
  5. Type `git add` to add the files
  6. Type `git commit`

Now you have created your first Git Repo and committed some code to it. 

## Create a Readme

A good file to create when when starting a Git Repo is to create README.md file to describe the project. You will need to create the README.md file in the top level directory of the project. [GitHub](https://github.com/) and other code hosting services such as [Bitbucket](https://bitbucket.org/) and [GitLab](https://about.gitlab.com/) will look for your README.md and display it along with the list of files and directories in your project.

You can write the README.md file, either as plain text or with [Markdown](https://daringfireball.net/projects/markdown/). Markdown allows you to add a bit of text markup, like [hyperlinks](https://en.wikipedia.org/wiki/Hyperlink), **bold**/_italics_, or to `indicate code`. Markdown is easily converted to html for viewing in a web browser, and GitHub will do this for you automatically.

## Create a repo from an existing project

What if you want to create a repo from a project already on your machine?

  1. Go into the directory containing the project.
  2. Type `git init`.
  3. Type `git add` to add all of the relevant files.
  4. To hide any sensitive information you will want to create a `.gitignore` file, this is used to indicate all of the files you don’t want to track. Use `git add .gitignore`, too. You can read more about the [.gitignore file here](https://git-scm.com/docs/gitignore).
  5. Type `git commit`.

Now you have turned your project into a Git Repo and committed your code. 

## Connect your Git Repo to GitHub

You’ve now created a local Git repository. You can use git locally, but what you want is the repo up on GitHub.

  1. Go to [GitHub](https://github.com/).
  2. Log in to your account.
  3. Click the [new repository](https://github.com/new) button in the top-right. You will also have an option there to initialize the repository with a README file if you haven&#8217;t already.
  4. Click the “Create repository” button.

Now, to push your repository to GitHub run the following in the Repository directory. 

<pre class="wp-block-code"><code>$ git remote add origin git@github.com:username/new_repo
$ git push -u origin master</code></pre>

If you don&#8217;t want to put in your password every time you push to GitHub you can set up [ssh](https://en.wikipedia.org/wiki/Secure_Shell) in your account. You can the push the Git repo then by running the following line in your terminal.

<pre class="wp-block-code"><code>$ git remote add origin https://github.com/username/new_repo
$ git push -u origin master</code></pre>

## Recommended GUI Git

If you are not a fan of typing in terminal I recommend [Sourcetree](https://www.sourcetreeapp.com/), an Atlassian program that allows simple interactions with GitHub.