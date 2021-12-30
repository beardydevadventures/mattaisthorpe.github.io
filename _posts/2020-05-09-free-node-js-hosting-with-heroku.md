---
id: 477
title: Free node.js hosting with Heroku
date: 2020-05-09T05:58:46+00:00
author: MatthewAisthorpe
excerpt: Sharing my findings for a free node.js hosting service!
layout: post
guid: https://matthewaisthorpe.com.au/?p=477
permalink: /free-node-js-hosting-with-heroku/
categories:
  - DevOps
  - Hosting
---
Recently I had to take a personal application I was working on and deploy it to an environment so I could demo it to work. I didn&#8217;t want to spend any money on additional hosting and was searching for free options out there and I came across Heroku.

Heroku is a cloud application platform that offers **free Node.js hosting**, which was exactly what I was looking for. Of course by using the free option there are some limitations but it works well to demo an app I have been building in a local environment, if the application is a success and kicks off I will look at paid hosting.

But I feel for anyone reading this is okay with those limitations and are just looking for free Node.js hosting to demo an application or play around with , it will benefit you as much as it has me!

Heroku also offers paid plans, which are also a good option depending on what you need to do. These are affordable starting from $7, of course there are other options like AWS for node.js hosting.

You are probably wondering what are the limitations are for Heroku’s free Node.js hosting? These are the limitations:

  * 512MB of memory
  * Sleeps after 30 minutes of inactivity
  * Only one user
  * Comes with a limit of 1000 _dyno hours_* per month

*dyno hours is a pool of run time hours your applications can use per month

From what I have read so far on Heroku site it is really well-documented, offers easy scaling, and is just generally pretty developer friendly. My application is using socket.io and they offered a [great example on their devcenter](https://devcenter.heroku.com/articles/node-websockets#option-2-socket-io) on how to set it up. 

Hope you found this article useful for a place to host your node.js applications!