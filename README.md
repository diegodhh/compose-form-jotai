<!-- @format -->

# Compose Form jotai

> _Compose fully-typed **form enhancers** into a single Jotai atom._

<p align="center">
  <a href="https://www.npmjs.com/package/compose-form-jotai">
    <img alt="npm" src="https://img.shields.io/npm/v/compose-form-jotai?color=cb3837&logo=npm" />
  </a>
  <a href="https://github.com/diegodhh/compose-form-jotai/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://github.com/diegodhh/compose-form-jotai">
    <img alt="Repo" src="https://img.shields.io/badge/Repo-GitHub-blue" />
  </a>
  <a href="https://github.com/diegodhh/compose-form-jotai-example">
    <img alt="Example" src="https://img.shields.io/badge/Example-Project-green" />
  </a>
</p>

---

`compose-form-jotai` is a tiny form management library built on top of
[Jotai](https://jotai.org/) that lets you build **type-safe, modular form state**
by composing small, isolated **enhancers**.

- **Modularity** – keep each form concern in its own enhancer.
- **Composition** – chain enhancers in a simple pipeline.
- **Type-safety** – form values, errors, and actions are fully typed end-to-end.
- **Validation** – built-in support for form validation.
- **Interop friendly** – works with any UI library.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
   1. [Form Atom](#form-atom)
   2. [Enhancers](#enhancers)
   3. [Form Actions](#form-actions)
4. [API Reference](#api-reference)
5. [Example Project](#example-project)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [License](#license)

---

## Installation
