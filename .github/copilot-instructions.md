# Yumdocs - Office Document Template Engine

## Project Overview
Yumdocs is a TypeScript/JavaScript library that serves as a template engine for Microsoft Office documents (Word, PowerPoint, Excel). It enables automated generation of .docx, .pptx, and .xlsx files by merging template documents with JSON data through expression tags.

## Key Concepts
- **Template Engine**: Processes OpenXML documents with embedded template tags
- **Expression Tags**: Template placeholders like `{{field}}`, `{{#each items}}`, `{{#if condition}}`
- **Multi-format Support**: Word (.docx), PowerPoint (.pptx), Excel (.xlsx)
- **Cross-platform**: Works in Node.js and browsers
- **Internationalization**: Built-in culture support for 15 locales

## Architecture

### Core Components
1. **YumTemplate** (`src/YumTemplate.ts`): Main template processing engine
2. **Tag System** (`src/tags/`): Extensible tag processors for different template operations
3. **Parts System** (`src/parts/`): OpenXML document part handlers
4. **Expression Engine** (`src/tags/expressionEngine.ts`): JEXL-based expression evaluation
5. **Culture Support** (`src/cultures/`): Localization and formatting

### Tag Types
- **ExpressionTag**: Simple value replacement `{{variable}}`
- **EachTag**: Loop iteration `{{#each items}}...{{/each}}`
- **IfTag**: Conditional rendering `{{#if condition}}...{{/if}}`
- **HtmlTag**: HTML content insertion
- **ImageTag**: Dynamic image insertion
- **TableTag**: Table generation

## Development Workflow

### Commands
- **Build**: `npm run build` - Creates UMD, CommonJS, and ES module distributions
- **Test**: `npm run test` - Runs Jest test suite with TypeScript
- **Lint**: `npm run lint` - ESLint with TypeScript and Prettier
- **Type Check**: `tsc --noEmit` - TypeScript compilation check
- **Dev**: `npm run dev` - TypeScript watch mode

### Code Quality Tools
- **TypeScript**: Strict mode enabled with ES2016 target
- **ESLint**: TypeScript-aware linting with Prettier integration
- **Jest**: Unit testing with ts-jest preset
- **Stryker**: Mutation testing framework
- **Rollup**: Multi-format bundling (UMD/CommonJS/ES modules)

### Testing Strategy
- **Unit Tests**: Located in `tests/unit/` with comprehensive coverage
- **Template Tests**: Document templates in `tests/templates/`
- **Integration Tests**: End-to-end document processing
- **Cross-platform**: Node.js and browser compatibility testing

## File Structure Patterns

### Source Organization
```
src/
├── index.ts           # Main exports
├── YumTemplate.ts     # Core engine
├── constants.ts       # Global constants
├── cultures/          # Localization
├── error/            # Error handling
├── parts/            # Document part processors
├── polyfills/        # Cross-platform compatibility
├── tags/             # Template tag processors
└── word/             # Word-specific utilities
```

### Naming Conventions
- **Classes**: PascalCase (YumTemplate, ExpressionTag)
- **Interfaces**: PascalCase with I prefix (IPart, ITag)
- **Files**: PascalCase for classes, camelCase for utilities
- **Constants**: UPPER_SNAKE_CASE
- **Methods**: camelCase

## Coding Standards

### TypeScript Patterns
- Use strict type checking
- Prefer interfaces over types for extensibility
- Export default for main classes, named exports for utilities
- Use generic constraints for type safety
- Implement proper error handling with YumError

### Testing Patterns
- Test files mirror source structure
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies (file system, DOM)
- Test cross-platform compatibility

### Documentation
- JSDoc comments for public APIs
- Inline comments for complex logic
- README with quick start examples
- TypeScript provides self-documenting interfaces

## Extension Points

### Custom Tags
Extend tag system by implementing ITagConstructor:
```typescript
class CustomTag extends AbstractTag {
  // Implementation
}
YumTemplate.registerTag('custom', CustomTag);
```

### Custom Parts
Add document part processors via IPartConstructor:
```typescript
class CustomPart extends AbstractPart {
  // Implementation  
}
YumTemplate.registerPart('custom', CustomPart);
```

### Custom Cultures
Register new locales through ICulture interface:
```typescript
YumTemplate.registerCulture('locale', cultureObject);
```

## Dependencies
- **Core**: @xmldom/xmldom, jszip, jexl, file-saver
- **Build**: rollup, typescript, ts-jest
- **Quality**: eslint, prettier, stryker
- **Testing**: jest, @faker-js/faker

## Browser Compatibility
- UMD build with Node.js polyfills
- File system abstraction for cross-platform support
- DOM manipulation through xmldom polyfill

## Performance Considerations
- Lazy loading of document parts
- Streaming ZIP file processing
- Expression caching in JEXL engine
- Minimal DOM manipulation

## Security Notes
- Input validation for template expressions
- Safe HTML rendering
- File type validation for uploads
- No arbitrary code execution in templates