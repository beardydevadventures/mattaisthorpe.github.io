---
title: JSON Object vs JSON Array
publishDate: 2020-05-16
img: /assets/posts/json-object-array.jpg
img_alt: A line of letter blocks spelling JSON
description: Recently, a colleague asked me about the differences between JSON Objects and Arrays, inspiring me to share this knowledge with everyone.
tags:
  - Code
---

Helping out a colleague at work the other day, they were attempting displaying some data in a table using JSON data. We were doing a loop over JSON data and they asked me what the difference is between JSON Objects and Arrays. It triggered me to think it would be best to share my knowledge with all of you as well.

## What is JSON?

JSON stands for **JavaScript Object Notation**, this is a syntax used for storing and exchanging data. There are two ways data can be stored in JSON, as objects or as arrays.

Here is an example of a JSON Object:

```
{
   "object": "value"
}
```

This is a JSON Array

```
[ 
   "value"
]
```


##JSON Objects

JSON Objects use key/value pairs to store their data, it does matter the order the keys are written in.

### Syntax

Keys must be strings, and values must be one of the below valid JSON data types. The Key and it’s value is separated by a colon and each key/value pair on a JSON Object is separated by a comma.

Valid JSON data types:

- string
- number
- object
- array
- boolean
- null

An example of a JSON object:

```
{ 
   "name": "Bruce", 
   "level": 27, 
   "class": "Warrior",
   "active": true
}
```

In JavaScript the Keys do not need double quotations and you can write string values with double or single quotes:

```
{ 
   name: "Bruce", 
   level: 27, 
   class: 'Warrior',
   active: true
}
```

### Accessing Object Values

Accessing values in a JSON object can be done two ways:

By using dot . notation:

```
var name = object.name;
```

Or using bracket [] notation:

```
var name = object["name"];
```

### Looping through Objects

In JavaScript JSON Objects can be looped through like this:

```
const jsonObject = {
  name: 'Gladus',
  level: 42
};

for (let [key, value] of Object.entries(jsonObject)) {
  console.log(`${key}: ${value}`);
}
```

In React JSON Objects can be looped through like this:
```
const jsonObject = {
  name: 'Gladus',
  level: 42
};

{Object.keys(jsonObject).map(key => (
   <Character key={key} details={jsonObject[key]} />
))}
```

### Nested JSON Objects

The true power of JSON, values set in a JSON object can also be another JSON object.

```
{
   "name": "Bruce", 
   "level": 27, 
   "equipment": {
      "main":"Sword",
      "off_hand":"Shield",
      "gold":100
   }
}
```

The nested values can be accessed using dot . and bracket [] notation:

```
var mainEquipment = object.equipment.main]; // . notation
var mainEquipment = object.equipment["main"]; // [] notation
```

## JSON Arrays

JSON Arrays are very similar to arrays in JavaScript. The order of the Array determines the order of the information displayed.

### Syntax

Values are separated by a comma and allow valid JSON data types:

- string
- number
- object
- array
- boolean
- null

JSON Arrays in JavaScript can also have other valid JavaScript expressions including:

- functions
- dates
- undefined

### Arrays in JSON Objects

Arrays can values set in a JSON object.

```
{
   "name": "Bruce", 
   "level": 27, 
   "items": [
      "Sword",
      "Shield",
      "Health Potion"
   ]
}
```

### Accessing Array Values in an Object

Accessing array values in a JSON object can be done using their index:

```
var item = object.items[0];
```

### Looping over Array Values

Array values can be looped over in JavaScript with a for loop

```
for (var item of object.items) {
   console.log(item);
}
```

## Conclusion

I hope this helped you with getting an understanding of the differences between JSON objects and JSON arrays.