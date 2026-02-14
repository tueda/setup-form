# setup-form

This action sets up [FORM](https://github.com/vermaseren/form) in your GitHub
workflows.

### Example

```yaml
steps:
- uses: actions/checkout@v6
- uses: tueda/setup-form@v1
  with:
    form-version: '5.0.0'
- run: form my_program.frm
```

This action simply downloads FORM binaries from
[GitHub Releases](https://github.com/vermaseren/form/releases),
so the corresponding `tar.gz` file (with respect to version, os, architecture)
should exist.

### License

The [MIT License](LICENSE).
