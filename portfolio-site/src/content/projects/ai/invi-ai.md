---
title: InVi AI – XR + AI Claim Inspections for Smart Glasses
publishDate: 2026-06-20 00:00:00
img: /assets/projects/invi-ai-cover.jpg
img_alt: Field inspector using smart glasses with AI-assisted damage detection overlays during a property claim inspection.
description: |
  An XRCC finalist project exploring how Meta Ray-Ban Display, Snap Spectacles, a companion Android app, and AI-assisted workflows can make insurance claim inspections faster and easier.
tags:
  - XR
  - AI
  - Smart Glasses
  - Android
  - Next.js
  - XRCC Finalist
featured: true
awardStatus: finalist
---

## Overview

InVi AI is an XR and AI insurance inspection platform exploring how smart glasses can make property claim inspections easier, faster, and more consistent.

The project was selected as a **finalist at XRCC** and is being developed with an international team spanning Canada, the USA, India, and Australia.

The core experience is designed around wearable devices such as **Meta Ray-Ban Display** and **Snap Spectacles**, supported by a companion **Android app** and **Next.js admin portal**.

Instead of forcing an inspector to constantly switch between a phone, checklist, camera, and report notes, InVi AI explores a heads-up workflow where prompts, evidence capture, and AI-assisted guidance can stay with the inspector while they move through the property.

## My Role

I lead the product and technical direction while also contributing hands-on to development.

My role includes coordinating the international team, shaping the prototype architecture and user experience, building the companion app experience, and leading the XR and AI integration.

This has meant balancing product decisions, platform constraints, team delivery, and hands-on experimentation across emerging wearable hardware.

## Key Features

- Smart glasses inspection flows for Meta Ray-Ban Display and Snap Spectacles
- Companion Android app for field workflows, camera access, and device connection
- Next.js admin portal for claim setup, inspection review, and reporting
- AI-assisted property damage review and evidence capture
- Voice-guided inspection steps
- Mobile fallback workflows when glasses are not connected
- Insurance claim reporting and review flows

## Technology Stack

- Wearables: Meta Ray-Ban Display, Snap Spectacles
- Mobile: Android companion app
- Web: Next.js admin portal
- AI: AI-assisted damage review and inspection support
- Product focus: insurance claim inspections, evidence capture, and field reporting

## Project Goal

Property claim inspections involve visual evidence, structured checklists, photos, location context, and reporting.

InVi AI explores how XR and AI can reduce friction in that process by helping inspectors capture the right information at the right time.

The goal is to make inspections feel less like manual administration and more like a guided field workflow, where wearable technology and AI support the inspector without getting in the way.

## Prototype &amp; Platform Trade-offs

One of our first major decisions was choosing which wearable platform to build the concept around.

We considered **Meta Quest 3, Meta Ray-Ban Display, and Snap Spectacles**. At the proof-of-concept stage, we did not yet have access to the wearable display hardware, so we used Quest 3 to validate the core interaction model and inspection workflow.

Rather than designing specifically for VR, we created a lightweight heads-up interface that approximated how the experience should work on smart glasses. This allowed us to validate the workflow before moving onto the target hardware.

When we gained access to Meta Ray-Ban Display during the hackathon, we faced another trade-off: whether to build the wearable experience using the native application path or a web-based interface.

The native approach provided access to the camera and microphone, but gave us a more limited visual experience. The web-based approach produced a stronger interface on the glasses, but did not provide the camera and microphone access we needed for the complete workflow.

As a team, we decided that demonstrating the wearable interface and overall product experience was the more important goal for the prototype.

We therefore used the web-based experience on the glasses and simulated the missing camera and microphone inputs through the companion mobile device during the demonstration.

This allowed us to show the intended end-to-end workflow despite the limitations of the available development APIs.

It was a deliberately prototype-focused decision: prioritise validating the experience and product direction first, while recognising that a production implementation would require deeper native integration as the hardware and SDK capabilities mature.

## Status

XRCC finalist / prototype in active development.