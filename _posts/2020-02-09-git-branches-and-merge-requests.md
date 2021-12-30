---
id: 337
title: Git Branches and Pull Requests
date: 2020-02-09T00:26:41+00:00
author: MatthewAisthorpe
excerpt: Increasing collaboration with repositories using branches and pull requests.
layout: post
guid: https://matthewaisthorpe.com.au/?p=337
permalink: /git-branches-and-merge-requests/
categories:
  - DevOps
---
Expanding further on our use of collaboration with [GitHub repositories](https://matthewaisthorpe.com.au/github-start-a-repository/), what if we have a major new feature we want a new feature to be developed? This is where branches and pull requests come into use.  
  
Use a branch to make an isolated copy of the main branch to work on. When that feature is complete you can use a pull request to get other developers to review your work before merging it back into the main branch.  
  
By using branches and pull requests it allows your project more code collaboration and take full advantage of a version control platform like GitHub.

## Branches

A branch is used to isolate development work without affecting other branches within the repository, this is useful for code heavy features that may affect a large portion of the site and may prevent code releases. 

Each repository created has one default branch usually main/master, other branches are created off this branch. A good practice is to have three branches Dev, UAT and Prod with a directory for features. 

An example repository layout would be like so:

<pre class="wp-block-code"><code>repository
├── dev
├── uat
├── prod
├── features/
│   ├── feature_1
│   ├── feature_2
│   ├── feature_3</code></pre>

### Feature Branch

A feature branch is used to develop new features for a project in isolation from the main branches. The name of the feature branch should describe the purpose of the feature. For example a feature changing search functionality of the product should be called something along the lines of &#8220;search_updates&#8221;. 

### Dev Branch

The Dev (develop) branch is used for collaboration of any new code and fixes for the project. This branch is used for developers to commit and collaborate their code while testing their changes. Any new features branches that are completed and accepted are merged into this branch first. Thorough testing is carried on this branch for next release.

### UAT Branch

The UAT (User Acceptance Testing) branch is for all collaborated features to be within one branch that can be viewed by the users of the project. It is used for pre-release testing and contain any new features that have been tested by developers but still require acceptance by the business before going to public. Once the branch is tested and all features are accepted the UAT branch is merged into the Production branch.  
  
Note: A good practice for features when coding them is to wrap them within a conditional statement that can be controlled by a config boolean.

### Prod Branch

The Prod (Production) branch contains the code that is being used in production. Before a release to production thorough testing is required to make sure no bugs go out to live. This branch is never edited directly.

## Pull Requests

A pull request allows you to visualise the code that is going to be committed to the requested branch. This allows you to better collaborate on the proposed changes to source code and avoid bugs getting into release.

A pull request should have a detailed description of the changes that will be implemented and any dependancies required for the feature to work.

A pull requests usually follows this process:

  1. You checkout a new branch, and submit your changes through a pull request
  2. You gather feedback about the changes in your pull request from your team
  3. You work with your team implementing feedback optimising your code
  4. <a rel="noreferrer noopener" target="_blank" href="https://about.gitlab.com/pricing/"></a>Your team approves of the pull request and flags it to be merged into the Dev branch
  5. A senior developer then:
      1. Overlooks the pull requests for any further issues
      2. Approves the pull request 
  6. Your changes get deployed to the Dev branch
  7. Your feature is now available in the Dev branch

###