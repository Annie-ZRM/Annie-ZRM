# Publish this profile README

GitHub shows a profile README when a **public repository has exactly the same name as the account**.

1. On GitHub, create a new **public** repository named `Annie-ZRM`.
2. Do not add a README, license, or `.gitignore on GitHub—the files in this folder already provide them.
3. In Terminal, enter this folder and run:

```bash
git init
git add README.md assets .github
git commit -m "Create profile README"
git branch -M main
git remote add origin https://github.com/Annie-ZRM/Annie-ZRM.git
git push -u origin main
```

4. Open the repository's **Actions** tab. If GitHub asks, enable workflows. The contribution snake runs automatically after the first push; it can take about a minute before it appears.

## Easy personal edits

- Change the introduction and current interests in `README.md`.
- Add project links around each title in **Selected creations** after publishing those repositories.
- Add an email, LinkedIn, or personal-site badge only when you want those contact details public.
- The animated banner is fully self-contained in `assets/hero.svg`; no external image host is required.

`SETUP.md` is for local reference and does not need to be pushed.
