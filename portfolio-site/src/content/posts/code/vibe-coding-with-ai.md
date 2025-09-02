---
title: Vibe Coding with AI - Why It's a Tool, Not a Shortcut
publishDate: 2025-04-08
img: /assets/posts/vibe-coding-with-ai.png
img_alt: A person looking at code on a screen
description: Exploring how AI tools like Cursor or ChatGPT can support, but not replace—the creative flow of coding.
tags:
  - AI
  - Development 
  - Best Practices
---

I’ve always considered myself a traditional coder. I like understanding how things work, writing code from scratch, and learning through the process. It might not be the fastest way, but it’s how I’ve built my skills.

Over time, tools like Cursor, Claude, and ChatGPT Copilot started showing up in my workflow. At first, I was cautious. I didn’t want to rely on something that might take away from the learning. But I started to see where they helped—clearing out the boring parts, speeding up small tasks, and giving me a boost when I hit a wall.

That’s when I came across the idea of vibe coding, a term coined by Andrej Karpathy. It’s those sessions where you’re in the flow, building as you go, reacting to the project in front of you. It’s less about rigid structure and more about creativity, momentum, and seeing where an idea takes you.

AI can be a great partner in that space. It helps keep things moving. But like any tool, there’s a tipping point. If you lean on it too much, it can take the steering wheel from you.

So let’s talk about where AI fits in, where it doesn’t, and how to keep that creative spark front and centre.

## What is Vibe Coding?

Vibe coding is a bit like spinning a roulette wheel. You start with a loose idea, begin building, and see what you end up with. Sometimes it lands exactly where you want. Other times it surprises you in a good way.

It’s not about following a strict plan. It’s about reacting to what’s in front of you, letting your instincts guide the next step. You might be chasing a cool effect, trying out a new mechanic, or just seeing what happens when you combine things.

In game dev, it could be tweaking a mechanic until it feels right. In UI work, it might be moving elements around until it looks and behaves the way you imagined. When prototyping, it’s about building fast and figuring it out as you go.

There’s no single path. Just flow, feedback, and a bit of chaos that leads to something new.

### Where AI Shines

When you’re in that creative flow, AI can be a huge ally, if you know how to use it well.

- **Boilerplate and repetition?** Sorted. AI can take care of the boring parts so you can focus on what matters.
- **“What if?” moments?** Just ask. It’s like having a coding partner who’s ready to brainstorm anytime.
- **Debugging help?** When you’re stuck, AI can throw out suggestions or point out something you missed.

When used the right way, AI doesn’t slow you down. It helps you stay in motion and keep the vibe going.

### Where AI Falls Short

But it’s not all upside.

- **Confidently wrong answers** can send you down the wrong path and break your momentum.
- **Relying on it too much** can leave you with surface-level knowledge. It’s like building with bricks you haven’t checked yourself.
- **Code you didn’t fully understand** can come back to bite you. If you don’t know how something works, you’ll spend more time fixing or rewriting it later.

AI can be a helpful co-pilot, but if you let it take the wheel, you might miss the whole point of the ride.

## A Balanced Approach

As useful as AI can be, it’s still worth giving things a shot yourself—especially if you’re just starting out. Even if you end up copying and pasting something, take the time to understand what the code is doing. That’s how you build confidence and skill that sticks.

For me, the sweet spot looks like this:

- **Try it yourself first.** Even if AI could do it faster, I want to feel it out.
- **Use AI for utilities, not architecture.** It can help with details, but I want the big picture to come from me.
- **Keep your gut in the loop.**  If AI’s suggestion doesn’t feel right, I change it, even if it “works.”

AI helps me stay keep momentum, but the *vibe*? That’s mine.

## My Experience with AI in a Project

I was recently working on a core management script to handle API calls across a project. The goal was to create something clean and centralised that could manage headers, handle errors, and deal with timeouts or retries in a secure and reliable way.

I asked ChatGPT for a starting point. It gave me a decent structure with async methods, some basic error handling, and retry logic. It looked fine at first glance, but once I started digging in, I noticed a few things that made me pause. There were no checks around failed auth tokens. Error responses were logged without sanitising sensitive data. Retry logic didn’t include any backoff.

That’s where my coding skills kicked in. I kept what worked, rewrote what didn’t, and made sure the final version followed best practices; things like token expiry checks, safe error handling, and clear logging that didn’t leak anything.

AI helped me move faster, but understanding the risks and taking responsibility for the final code is what made it safe and usable.

## Final Thoughts

Vibe coding is great for prototyping or building out a proof of concept. It’s a space where creativity leads, where you can experiment freely and move fast. But when it comes time to build a real product that is maintainable, scalable, and secure, it needs to be built from the ground up by professional developers who take care and have experience.

AI can help speed things up, but at the end of the day, developers are responsible for the code they commit. You should know how it works, why it’s there, and what it might break.

It's also worth remembering that AI isn't truly creative. It works by predicting patterns based on what it already knows. The real spark comes from you. You're the one who asks new questions, takes creative risks, and makes something that hasn't been seen before.

Use AI to reduce friction, not to skip the process. Let it support your creativity, not replace it.
