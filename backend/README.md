## Code Formatting and Linting

### Java - Spotless

This project uses Spotless to enforce consistent code formatting in Java files

### Check formatting

To verify if your java code is properly formatted:

```bash
mvn spotless:check
```

If any file is incorrectly formatted, the command will fail and list the issues

### Automatically format code

To automatically fix formatting issues:

```bash
mvn spotless:apply
```

This will reformat your Java code to match the project's style guidelines.

### Python - Ruff

This project uses Ruff as fast Python linter and formatter

### Install dependencies

Make sure all dependencies are installed (including Ruff):

```bash
pip install -r requirements.txt
```

### Check for linting issues

To check Python files for style and linting problems:

```bash
ruff check .
```

This will scan all Python files and list any issues without modifying the code.

### Automatically fix linting issues

```bash
ruff check . --fix
```

### Automatically fix formatting issues

To auto-format Python code according to Ruff's rules:

```bash
ruff format .
```

Optionally, use `--check` to verify formatting without applying changes:

```bash
ruff format . --check
```

