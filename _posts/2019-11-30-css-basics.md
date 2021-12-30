---
id: 206
title: CSS Basics
date: 2019-11-30T10:51:02+00:00
author: MatthewAisthorpe
excerpt: A run through of how to apply styles to a web page using CSS.
layout: post
guid: https://matthewaisthorpe.com.au/?p=206
permalink: /css-basics/
categories:
  - Code
  - Design
---
Following up from my [HTML basics post](https://matthewaisthorpe.com.au/html-basics/) as nice as it is to have text on the screen but it could really use some colours and change the layout to look a bit nicer. How do we achieve this? With the use of CSS (Cascading Style Sheets).

CSS is used to tell the browser how HTML elements are to be displayed on specific devices. There are a few ways to implement styles on a web page. 

## CSS Syntax

A CSS rule-set consists of a selector and a declaration block, look at the example CSS rule set below:

<pre class="wp-block-code"><code>p {
   color: green;
   font-size: 25px;
}</code></pre>

The p is a selector that points to the HTML element you want to style.

The declaration block is wrapped in curly braces and contain one or more declarations to style the separated by semicolons.

Each declaration includes a CSS property name and a value, separated by a colon. In the example above we are changing the color of the text to green and making the font-size 25px.

## CSS Selectors

CSS selectors are used to search the HTML for elements you want to style. 

### Element Selectors

The element selector selects the HTML elements with specified element name. For example to style all p elements you would use the follow CSS.

<pre class="wp-block-code"><code>p {
   color: green;
}</code></pre>

### ID selectors

The id selector uses the id attribute of an HTML element to select a specific element. The id is unique and ID selectors are used to select one single element.

To select an element id, write a # character, followed by the id of the element.

<pre class="wp-block-code"><code>#green-text-once {
   color: green;
}</code></pre>

This will make the text green to following HTML with the id attribute.

<pre class="wp-block-code"><code>&lt;h1 id="green-text-once">A header.&lt;/h1></code></pre>

### Class selectors

The class selector uses the class attribute of an HTML element to select a specific element. 

To select an element class, write a . character, followed by the id of the element.

<pre class="wp-block-code"><code>.green-text-multiple {
   color: green;
}</code></pre>

This will make the text green to following HTML elements with the class attribute.

<pre class="wp-block-code"><code>&lt;h1 class="green-text-multiple">A header.&lt;/h1>
&lt;p class="green-text-multiple">A paragraph.&lt;/p></code></pre>

## Internal CSS

One way to implement styles on the page is with use of a <style><style> tag placed within the <head></head> tag of a HTML document.

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
    &lt;head>
        &lt;style>
            p {
                color: green;
            }
        &lt;/style>
    &lt;/head>
    &lt;body>
        &lt;p>A paragraph.&lt;/p>
    &lt;/body>
&lt;/html></code></pre>

This example is making the text colour green in a p tag.

## External CSS

Using external CSS files allows you to change the style across your site in one location. You can use an external CSS with a <link> element placed within the <head></head> tag of a HTML document.

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
    &lt;head>
        &lt;link rel="stylesheet" type="text/css" href="css/style.css">
    &lt;/head>
    &lt;body>
        &lt;p>A paragraph.&lt;/p>
    &lt;/body>
&lt;/html></code></pre>

Within your style.css file.

<pre class="wp-block-code"><code>p {
    color: green;
}</code></pre>

## Inline CSS

An inline CSS may be used to apply a style to a single element. To apply inline CSS, add the style attribute to the element you want to style. The style attribute only needs the CSS property.

<pre class="wp-block-code"><code>&lt;!DOCTYPE html>
&lt;html>
    &lt;head>
    &lt;/head>
    &lt;body>
        &lt;p style="color:green;">A paragraph.&lt;/p>
    &lt;/body>
&lt;/html></code></pre>