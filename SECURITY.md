# Security Policy

## Supported Versions

Since **Yakuake Skin Generator** is a web-based utility actively developed for
modern browsers, security updates and bug fixes are provided for the latest
stable release.

| Version | Supported |
| ------- | :-------: |
| 0.0.0   |    ✅     |

## Security Model & Scope

Yakuake Skin Generator is a frontend client-side application built with Preact,
Vite, and Tailwind CSS designed to help users create, customize, and export
configuration skins for the Yakuake drop-down terminal.

- **Client-Side Execution:** The application runs entirely within your browser
  sandbox. No sensitive local data or files are transmitted to external servers.
- **Exported Artifacts:** The generated skin configuration files are meant to be
  downloaded and applied locally to your personal KDE/Yakuake setup. Users are
  responsible for reviewing any custom code, styling, or configuration
  parameters they import or export.

## Reporting a Vulnerability

If you discover a security vulnerability, unexpected data exposure risk, or
logic flaw within this repository, please report it responsibly:

- Do not open a public GitHub issue for sensitive security bugs.
- Instead, please report details directly via private communication channels
  (e.g., repository security advisories or by contacting the maintainer
  directly).
- Provide as much detail as possible, including:
    - Steps to reproduce the issue.
    - Environment details (Browser type/version, OS).
    - Any relevant console logs or error outputs.

Thank you for helping keep Yakuake Skin Generator secure and reliable!
