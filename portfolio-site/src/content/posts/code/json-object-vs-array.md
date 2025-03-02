---
title: JSON Object vs JSON Array
publishDate: 2020-16-05
img: /assets/posts/json-object-array.jpg
img_alt: A line of letter blocks spelling JSON
description: Recently, a colleague asked me about the differences between JSON Objects and Arrays, inspiring me to share this knowledge with everyone.
tags:
  - Code
---

Recently, a colleague asked me about the differences between **JSON Objects** and **JSON Arrays** while working on displaying data in a table. We were iterating over a JSON dataset when they asked:

> *"What's the actual difference between a JSON Object and a JSON Array?"*

That conversation made me realise that many developers, especially those new to JSON, might have the same question. So, let’s break it down!

---

## What is JSON?

JSON stands for **JavaScript Object Notation**, this is a syntax used for storing and exchanging data. 

Data in JSON can be stored in **two primary structures**:

1. **Objects** (key-value pairs)
2. **Arrays** (ordered lists)

Here’s a quick comparison:

**Example of a JSON Object**:

```json
{
   "object": "value"
}
```

**Example of a JSON Array:**

```json
[ 
   "value"
]
```


## JSON Objects

A JSON Object stores data in key-value pairs, similar to a dictionary in Python or a Map in other languages. The order of keys does not matter, but they must be unique.

### Syntax

Keys must be strings (wrapped in double quotes) and values must be a valid JSON data type. 

Valid JSON data types:

- ✅ String
- ✅ Number
- ✅ Object
- ✅ Array
- ✅ Boolean (true/false)
- ✅ Null

Example JSON Object:

```json
{ 
   "name": "Bruce", 
   "level": 27, 
   "class": "Warrior",
   "active": true
}
```

### JSON vs JavaScript Objects

In JavaScript, keys don’t need double quotes, and strings can use single or double quotes:

```js
{ 
   name: "Bruce", 
   level: 27, 
   class: 'Warrior',
   active: true
}
```

### Accessing Object Values

You can access values in a JSON Object using dot notation or bracket notation:

```js
var name = object.name; // Dot notation
var name = object["name"]; // Bracket notation
```

### Looping through Objects

In JavaScript, you can loop through JSON Objects using Object.entries():
```js
const jsonObject = {
  name: 'Gladus',
  level: 42
};

for (let [key, value] of Object.entries(jsonObject)) {
  console.log(`${key}: ${value}`);
}
```

In React, you can loop through JSON Objects like this:
```jsx
const jsonObject = {
  name: 'Gladus',
  level: 42
};

{Object.keys(jsonObject).map(key => (
   <Character key={key} details={jsonObject[key]} />
))}
```

### Nested JSON Objects

A JSON Object can contain another JSON Object as a value, this is where JSON becomes very powerful.

Example Nested JSON Object:
```json
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
### Accessing Nested Values

To access nested values, you can use dot notation or bracket notation:

```js
var mainEquipment = object.equipment.main; // Dot notation
var mainEquipment = object["equipment"]["main"]; // Bracket notation
```

## JSON Arrays

A JSON Array is similar to a JavaScript array, an ordered list of values where position matters.

### Syntax

Values inside a JSON Array are comma-separated and can be:

- ✅ String
- ✅ Number
- ✅ Object
- ✅ Array
- ✅ Boolean (true/false)
- ✅ Null

JSON Arrays in JavaScript allows additional types, like:

- ✅ Functions
- ✅ Dates
- ✅ undefined (not valid in JSON)

### Arrays Inside JSON Objects

JSON Arrays can also be stored inside JSON Objects.

Example: JSON Object with an Array:
```json
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

To access values inside an array, use their index (starting from 0):

```js
var item = object.items[0]; // "Sword"
```

### Looping Over JSON Arrays

You can iterate over JSON Arrays using a for loop:

```js
for (var item of object.items) {
   console.log(item);
}
```

Alternatively, using .forEach():
```js
object.items.forEach(item => console.log(item));
```
## Conclusion

Understanding the difference between JSON Objects and JSON Arrays is essential for working with APIs, databases, and structured data in JavaScript.

### 💡 Key Takeaways
- ✔ JSON Objects store data in key-value pairs (unordered).
- ✔ JSON Arrays store ordered lists of values.
- ✔ You can nest Objects and Arrays within JSON for complex data structures.

I hope this post helped clarify JSON Objects vs JSON Arrays!