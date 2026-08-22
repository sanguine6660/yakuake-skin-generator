# Contributing to Yakuake Skin Generator

First off, thank you for taking the time to contribute! 🎉 Whether it's
reporting a bug, improving documentation, or submitting a feature request, all
contributions are appreciated.

Please follow these guidelines to help make the contribution process smooth and
effective for everyone.

---

## Code of Conduct

By participating in this project, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior
to the project maintainers.

---

## How Can I Contribute?

### 1. Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.
When creating an issue, include:

- A clear and descriptive title.
- Steps to reproduce the behavior.
- Your operating system and browser version.
- Screenshots or console logs if applicable.

### 2. Suggesting Enhancements

Have an idea for a new feature (e.g., more icon libraries, custom color presets,
new export options)? Open an issue and describe:

- The clear use case for the feature.
- How it would benefit users of the Yakuake Skin Generator.

### 3. Pull Requests (Code Contributions)

1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** for your feature or bug fix:

    ```bash
    git checkout -b feature/amazing-feature
    ```

3. **Install dependencies**:

```bash
npm install

```

4. **Run the development server** to test your changes (runs on port 4000 across
   all interfaces):

```bash
npm run dev

```

5. **Format your code** using Prettier before committing:

```bash
npm run format

```

6. **Verify the build** to ensure there are no TypeScript or compilation errors:

```bash
npm run build

```

7. **Commit your changes** with clear, descriptive commit messages.
8. **Push to your fork** and open a Pull Request against the `main` branch.

---

## Development Guidelines

### Code Style & Formatting

- This project uses Prettier with `prettier-plugin-tailwindcss` and
  `prettier-plugin-yaml` to enforce consistent code styling.
- Running `npm run format` will automatically sort your Tailwind classes and
  format all TypeScript, CSS, JSON, Markdown, and YAML files.

### TypeScript Standards

- Maintain **strict type safety**. Avoid using `any` unless strictly necessary.
- Export and import types through the barrel files (`index.ts`) located inside
  each directory to keep imports clean.

### Component Structure & Architecture

Keep the modular structure organized when introducing new components or
utilities:

```text
src/
├── components/
│   ├── forms/        # Form and configuration inputs
│   ├── preview/      # Yakuake real-time preview components
│   └── ui/           # Reusable UI components
├── constants/        # Default configurations, icon libraries, presets
├── hooks/            # Custom hooks (useSkinConfig, useSkinExport)
├── types/            # TypeScript interface and type definitions
├── utils/            # SVG generation, tar.gz export, icon rendering/paths
├── assets/           # Static assets and images
├── app.tsx           # Main application layout & state orchestration
├── main.tsx          # Application entry point
└── index.css         # Tailwind CSS styles

```

Thank you for helping improve the Yakuake Skin Generator! 🚀
