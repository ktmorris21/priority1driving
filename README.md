# Priority One Driving Review

Small Node/Express application that accepts review information, fills the existing Harris County Constable Precinct Five Priority One Driving Review AcroForm PDF, and emails the completed PDF.

## Current scaffold

- GitHub Codespaces-ready dev container
- Express backend
- Static HTML/CSS/JS frontend
- `pdf-lib` PDF population
- Nodemailer SMTP support
- Safe development email mode (`EMAIL_MODE=console`)
- Central PDF field mapping and recipient-routing modules
- Railway-compatible `PORT` handling
- No database or persistent filesystem required

## PDF fields populated

- Employee Name
- Employee PID
- Unit #
- Shift
- Shop #
- Event Date
- Event Time
- Incident #
- Event Type
- Event Address

The lower portion of the official form remains untouched for supervisor completion.

## Run in a Codespace

1. Create/open a Codespace for the repository.
2. The dev container runs `npm install` automatically.
3. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

4. Keep `EMAIL_MODE=console` during development.
5. Start the app:

   ```bash
   npm run dev
   ```

6. Open forwarded port 3000 when Codespaces prompts you.

## Email behavior during development

With:

```text
EMAIL_MODE=console
```

the application still validates the request and generates the completed PDF in memory, but does **not** send email. It logs the intended recipients, filename, and attachment size instead.

To use real SMTP later, set:

```text
EMAIL_MODE=smtp
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=...
```

## Recipient routing

`config/routing.js` is intentionally a placeholder until the routing rules are defined. For now it reads comma-separated fallback recipients from:

```text
DEFAULT_RECIPIENTS=person1@example.org,person2@example.org
```

## Railway deployment

Connect the GitHub repository to a Railway service. Railway should detect Node automatically and run `npm start`.

Configure environment variables in Railway rather than committing a `.env` file. At minimum, set:

```text
NODE_ENV=production
EMAIL_MODE=console
```

while testing the deployment. Add the SMTP and routing variables when ready for live email.

No persistent volume is needed: the source PDF ships with the application and each completed PDF is generated in memory.

## Still to define

- Final web-field data types/options/constraints
- Which fields are required
- Recipient routing rules
- SMTP provider/account
- Whether employee information should be prefilled or remembered
- Final custom domain
- Authentication/access-control requirements, if any
