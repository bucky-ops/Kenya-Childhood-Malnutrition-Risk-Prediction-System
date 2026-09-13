# Kenya Childhood Malnutrition Risk Prediction System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/web-Next.js%2015-black.svg)](https://nextjs.org/)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black.svg)](https://vercel.com/)

> An open-source **Digital Public Good** for predicting acute childhood
> malnutrition risk in Kenya using machine learning and WHO Data Quality
> Review (DQR) standards.

## 🌐 Live Web Dashboard

The system is deployed as a modern Next.js web app and is **live on Vercel**:

**🟢 Live URL: https://web-amber-xi-94.vercel.app/**

- **Web app source:** [`web/`](web/) directory
- **Data:** bundled as static JSON (`web/data/malnutrition_data.json`) generated
  from the ML pipeline's `data/processed/predictions.csv`
- **Database (optional):** Neon Postgres integration is wired in
  (`web/lib/data.ts`); set `DATABASE_URL` in Vercel to switch from static JSON
  to a live database. See [`web/scripts/seed_neon.sql`](web/scripts/seed_neon.sql).

## Features

### ML & Data Pipeline (Python)
- **Random Forest** model trained on WHO + UNICEF + DHIS2 indicators
- **WHO DQR-compliant** data quality validation and scoring
- **Quality-weighted** training that prioritises high-quality data sources
- **Uncertainty quantification** with confidence intervals
- **Scenario analysis** for policy-impact simulation

### Web Dashboard (Next.js + Recharts)
- 📊 National actual-vs-predicted trend with shaded area chart
- 🗺️ County-level bar chart colour-coded by risk level (critical/high/moderate/low)
- 🔍 Interactive county selector with detailed time-series comparison
- 📋 Sortable county risk-ranking table (click a row to inspect)
- ✅ WHO DQR data quality validation panel
- 📱 Fully responsive (mobile-first)

### Dashboards (Streamlit — for local power users)
- `app/app.py` — main prediction dashboard
- `app/executive_dashboard.py` — national executive dashboard with scenarios
- `app/data_quality_app.py` — DHIS2-style data quality review

## Quick Start

### Option A: Run the web dashboard (recommended)

```bash
cd web
npm install
npm run dev          # http://localhost:3001
```

To build for production:
```bash
npm run build
npm run start
```

### Option B: Run the Python ML pipeline

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python system_launcher.py --pipeline
streamlit run app/app.py
```

### Option C: Deploy to Vercel

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com) — framework auto-detected as Next.js.
3. (Optional) Set `DATABASE_URL` to a Neon Postgres connection string and run
   [`web/scripts/seed_neon.sql`](web/scripts/seed_neon.sql) to switch from
   static JSON to a live database.
4. Deploy. You'll get a `*.vercel.app` URL.

## Project Structure

```
├── web/                  # Next.js web dashboard (deployed to Vercel)
│   ├── app/              # App Router pages
│   ├── components/       # React components (charts, cards, tables)
│   ├── lib/              # Types + Neon data layer
│   ├── data/             # Bundled JSON data
│   └── scripts/         # Neon seed SQL
├── app/                  # Streamlit dashboards (local power-user tools)
├── src/                  # Python ML pipeline (data, models, validation, reporting)
├── data/                 # Raw + processed data (CSV)
├── models/               # Trained Random Forest models (.pkl)
├── config/               # Centralised Python config
├── tests/                # Pytest suite (21 tests)
├── vercel.json           # Vercel deployment config
└── pyproject.toml        # Python package metadata
```

## Data Sources

- **WHO** — Ch11 Nutrition Figures
- **UNICEF** — JMP 2021 WASH inequalities
- **DHIS2** — Kenya nutrition indicators
- **Kenya MoH** — climate, economic data

All data used in this repository is **synthetic / publicly available** and
contains no personal health information (PHI).

## Testing

```bash
# Python tests
pytest                            # 21 tests

# Web app
cd web && npm run build           # type-check + build
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Pull requests welcome.

## License

MIT — see [LICENSE](LICENSE).

---

*Built for humanitarian impact through ethical AI and open data.*
*Predictions are for programmatic planning only — individual clinical decisions
must be made by qualified health professionals.*
