# Soroban School

A small, self-paced soroban course published with GitHub Pages.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. If the repository is a project site, set `baseurl` in `_config.yml` to `/<repository-name>`.

The site uses the `just-the-docs` remote theme and GitHub Pages' Jekyll build. No generated site or build workflow is required.

## Preview locally

Install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000`.