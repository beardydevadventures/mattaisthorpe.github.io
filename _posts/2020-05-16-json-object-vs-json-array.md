---
id: 485
title: JSON Object vs JSON Array
date: 2020-05-16T06:22:07+00:00
author: MatthewAisthorpe
excerpt: A overview of JSON Objects and Arrays, their differences and how to access their data.
layout: post
guid: https://matthewaisthorpe.com.au/?p=485
permalink: /json-object-vs-json-array/
categories:
  - Code
---
Helping out a colleague at work the other day, they were attempting displaying some data in a table using JSON data. We were doing a loop over JSON data and they asked me what is the difference is between JSON Objects and Arrays. It triggered me to think it would be best to share my knowledge with all of you as well.

## What is JSON?

JSON stands for **J**ava**S**cript **O**bject **N**otation, this is a syntax used for storing and exchanging data. There are two ways data can be stored in JSON, as objects or as arrays.

This is a JSON Object

<pre class="wp-block-code"><code>{
   "object": "value"
}</code></pre>

This is a JSON Array

<pre class="wp-block-code"><code>&#91; 
   "value"
]</code></pre>

Not much difference between the way both JSON data is written right? Objects use curly braces `{}` and Arrays use square brackets `[]` but either choice determines the way of looping through and retrieving values from the data.

## JSON Objects

JSON Objects use key/value pairs to store their data, it does matter the order the keys are written in.

### Syntax

Keys must be strings, and values must be one of the below valid JSON data types. The Key and it&#8217;s value is separated by a colon and each key/value pair on a JSON Object is separated by a comma.

Valid JSON data types:

  * string
  * number
  * object
  * array
  * boolean
  * null

An example of a JSON object:

<pre class="wp-block-code"><code>{ 
   "name": "Bruce", 
   "level": 27, 
   "class": "Warrior",
   "active": true
}</code></pre>

In JavaScript the Keys do not need double quotations and you can write string values with double or single quotes:

<pre class="wp-block-code"><code>{ 
   name: "Bruce", 
   level: 27, 
   class: 'Warrior',
   active: true
}</code></pre>

### Accessing Object Values

Accessing values in a JSON object can be done two ways:

By using dot `.` notation:

<pre class="wp-block-code"><code>var name = object.name;</code></pre>

Or using bracket `[]` notation:

<pre class="wp-block-code"><code>var name = object&#91;"name"];</code></pre>

### Looping through Objects

In JavaScript JSON Objects can be looped through like this:

<pre class="wp-block-code"><code>const jsonObject = {
  name: 'Gladus',
  level: 42
};

for (let &#91;key, value] of Object.entries(jsonObject)) {
  console.log(`${key}: ${value}`);
}</code></pre>

In React JSON Objects can be looped through like this:

<pre class="wp-block-code"><code>const jsonObject = {
  name: 'Gladus',
  level: 42
};

{Object.keys(jsonObject).map(key => (
   &lt;Character key={key} details={jsonObject&#91;key]} />
))}</code></pre>

### Nested JSON Objects

The true power of JSON, values set in a JSON object can also be another JSON object.

<pre class="wp-block-code"><code>{
   "name": "Bruce", 
   "level": 27, 
   "equipment": {
      "main":"Sword",
      "off_hand":"Shield",
      "gold":100
   }
}</code></pre>

The nested values can be accessed using dot `.` and bracket `[]` notation:

<pre class="wp-block-code"><code>var mainEquipment = object.equipment.main]; // . notation
var mainEquipment = object.equipment&#91;"main"]; // &#91;] notation</code></pre>

## JSON Arrays

JSON Arrays are very similar to arrays in JavaScript. The order of the Array determines the order of the information displayed.

### Syntax

Values are separated by a comma and allow valid JSON data types:

  * string
  * number
  * object
  * array
  * boolean
  * null

JSON Arrays in JavaScript can also have other valid JavaScript expressions including: 

  * functions
  * dates
  * undefined

### Arrays in JSON Objects

Arrays can values set in a JSON object.

<pre class="wp-block-code"><code>{
   "name": "Bruce", 
   "level": 27, 
   "items": &#91;
      "Sword",
      "Shield",
      "Health Potion"
   ]
}</code></pre>

### Accessing Array Values in an Object

Accessing array values in a JSON object can be done using their index:

<pre class="wp-block-code"><code>var item = object.items&#91;0];</code></pre>

### Looping over Array Values

Array values can be looped over in JavaScript with a for loop

<pre class="wp-block-code"><code>for (var item of object.items) {
   console.log(item);
}</code></pre>