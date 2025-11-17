# Contributing to MITC Store

Thank you for considering contributing to MITC Store! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Burhan-sheikh/mitc-store/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Commit with clear messages: `git commit -m "feat: add new feature"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request

### Commit Message Convention

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Style

- Use ESLint for JavaScript linting
- Follow existing code patterns
- Write clear, readable code with comments
- Use meaningful variable and function names

### Testing

- Test your changes in both light and dark mode
- Test on mobile and desktop viewports
- Verify Firebase integration works
- Check image compression functionality

### Documentation

- Update README.md if you change functionality
- Add comments to complex code
- Update type definitions if applicable

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mitc-store.git

# Install dependencies
cd mitc-store
npm install

# Create .env file
cp .env.example .env
# Fill in your Firebase credentials

# Start development server
npm run dev
```

## Questions?

Feel free to open an issue for any questions about contributing!

## Code of Conduct

Be respectful, inclusive, and collaborative. We're all here to build something great together.

Thank you for contributing! 🚀