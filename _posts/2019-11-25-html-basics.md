---
id: 198
title: HTML Basics
date: 2019-11-25T11:42:50+00:00
author: MatthewAisthorpe
excerpt: A run through of a few basic HTML elements and some code snippets.
layout: post
guid: https://matthewaisthorpe.com.au/?p=198
permalink: /html-basics/
categories:
  - Code
---
Hi there! So I thought I would start with the basic structure of HTML and a few elements to help you start developing a web page.  
  
What does HTML stand for? Hyper Text Markup Language  
  
HTML is used to describe the structure of a web page to the browser this is a series of elements known as tags to tell the browser how to display the content. Tags are not displayed but the content in between the tags are rendered to the browser for the user to view.

## HTML Document

Below I have an example of a basic framework for a HTML document. 

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>

  &lt;head>
  &lt;/head>

  &lt;body>
  &lt;/body>

&lt;/html></code></pre>

The basics of a HTML document layout are:

  * All HTML documents must start with a document type declaration. 
  * The HTML document code is contained between the <html> </html> tags. 
  * The content visible to a user when they view your page is between the <body> </body> tags. 

## HTML Headers

Your users will need a way to distinguish the content HTML headers put in larger text making it stand out. Header tags also help search engines like google work out what the content of the page is about.  
  
Headers are defined with the tags <h1></h1> through to <h6></h6> these tags help title your content to be easier to read by the user of your site.

## HTML Paragraphs

You will need to put in content on your page for you users so they understand what you page is about. The provide the blocks of text like you are reading now.  
  
Paragraphs are defined with <p></p> tags. You can also make the paragraph move to a new line with the <br> tag.

## HTML Links

You may want to be able to navigate your user to another website or page, this can be achieved with an <a></a> tag. With the <a> tag you can navigate a user to a url using the href attribute. For example:  


<pre class="wp-block-code"><code>&lt;a href="https://www.google.com/">Link to google&lt;/a></code></pre>

## HTML Images

Add some colour to your site with a picture of your favourite pet using a <img> tag. This tag requires the image to be in a located somehwere on the internet so your users can see it too. Using the src attribute you can set the location of the image file to display. The alt attribute can be used to display text if the image cannot be found. You can also use the width and height attributes to set the pixel size for the image, be careful as you may distort the image.

<pre class="wp-block-code"><code>&lt;img src="best_image.jpg" alt="Best Image" width="110" height="145"></code></pre>

## HTML Lists

Display a nice dot point or numbered list of information for your users. Dot point lists are defined with <ul> </ul> tags, ul meaning unordered lists. Numbered lists are defined with <ol> </ol> tags, ol meaning ordered lists. Either list requires list items to be defined for each point using the <li> </li> tag. Make sure you keep your HTML code for your lists well formatted to avoid not closing the tags.

  * So you
  * can make
  * a list
  * like 
  * this

<pre class="wp-block-code"><code>&lt;ul>
  &lt;li>So you&lt;/li>
  &lt;li>can make&lt;/li>
  &lt;li>a list&lt;/li>
  &lt;li>like this&lt;/li>
&lt;/ul>

&lt;ol>
  &lt;li>or make&lt;/li>
  &lt;li>a numbered list&lt;/li>
  &lt;li>like this&lt;/li>
&lt;/ol></code></pre>