---
title: Cybersecurity Check – AI-Powered Website Security Reports
publishDate: 2026-06-20 00:00:00
img: /assets/projects/cybersecurity-check-cover.jpg
img_alt: Cybersecurity dashboard showing a website scan summary, risk score, security checklist, and recommended actions.
description: |
  A Brisbane-based SaaS platform using structured security scanning and generative AI to turn technical website findings into clear, actionable reports for small businesses.
tags:
  - SaaS
  - Cybersecurity
  - Generative AI
  - Web App
  - Reporting
featured: true
---

## Overview

Cybersecurity Check is a Brisbane-based SaaS project focused on helping small businesses understand and improve their website security without needing deep technical knowledge.

I lead the technology and development side of the project, shaping the platform architecture, scanning capability, AI-assisted reporting workflow, product direction, and technical roadmap.

[Visit Cybersecurity Check](https://cybersecuritycheck.com.au/)

## The Problem

Small businesses are increasingly expected to understand their cybersecurity risk, but many existing security tools are designed for technical users.

A traditional website scan can produce a long list of headers, configuration issues, DNS findings, certificate information, and other technical results without clearly explaining what any of it means to the business.

Cybersecurity Check is designed to bridge that gap.

The goal is not simply to find issues, but to turn technical findings into clear answers:

- What did we find?
- Why does it matter?
- How serious is it?
- What should the business do next?

## My Role

I lead the technical direction and development of the platform, working across product decisions, architecture, implementation, and delivery.

My responsibilities include:

- Defining the platform and application architecture
- Shaping the website scanning and assessment workflow
- Designing the AI-assisted reporting approach
- Leading development priorities and the technical roadmap
- Balancing automated analysis with reliable, deterministic security checks

## AI and Architecture Approach

One of the key design decisions has been separating **security detection from AI interpretation**.

The generative AI layer is not responsible for deciding whether a security issue exists. Website scanning and assessment produce structured findings first.

Those results can then be provided to the AI layer as context so it can help turn technical information into:

- Plain-English summaries
- Risk explanations
- Recommended actions
- Business-friendly report content

This keeps the underlying assessment grounded in real scan data while using AI where it is strongest: explaining, summarising, and making technical information easier to act on.

The project is also exploring tool-connected AI workflows that allow models to work with scanning tools and structured report data rather than relying on prompts alone.

## Architecture Principles

A few principles have guided the platform as it has developed:

**Keep security findings deterministic.**  
The underlying checks should come from the scanning and assessment layer rather than relying on generative AI to identify security findings.

**Use AI for interpretation, not authority.**  
AI helps communicate findings and recommendations, but the report needs to remain grounded in structured evidence.

**Design for non-technical users.**  
Technical accuracy matters, but a report is only useful if a business owner can understand what the issue means and what to do next.

**Build the scanning and reporting workflow as a platform.**  
The longer-term architecture is being designed around reusable scanning capabilities, structured findings, report generation, and tool-connected AI workflows rather than a single one-off report.

## What It Does

Cybersecurity Check scans a business website for common security and configuration issues and turns those findings into a clear, business-friendly report.

Current areas include:

- Website security scan summaries
- Security checklist and issue detection
- Plain-English risk reporting
- AI-assisted explanations and recommendations
- Business-focused next steps
- Report and lead capture workflows
- Structured findings that can support future AI and automation workflows

## Product Direction

The longer-term direction is to build Cybersecurity Check into a practical security assessment platform for organisations without dedicated security expertise. The focus is on connecting structured scanning, reporting, automation, and AI while keeping the underlying assessment grounded in reliable technical checks.

## Current Status

The Cybersecurity Check website is live, with the SaaS platform and scanning/reporting capabilities in active development.
