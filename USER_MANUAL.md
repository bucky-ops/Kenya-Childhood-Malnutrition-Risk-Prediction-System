# User Manual — Caregivers

## Table of Contents
1. [Getting Started](#getting-started)
2. [Using the Interactive Map](#using-the-interactive-map)
3. [Assessing a Child's Risk](#assessing-a-childs-risk)
4. [Subscribing to Alerts](#subscribing-to-alerts)
5. [Reading County Stories](#reading-county-stories)
6. [Asking Questions](#asking-questions)
7. [Sharing Your Story](#sharing-your-story)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

**What is this system?**
The Kenya Childhood Malnutrition Risk Prediction System is a free, open-source web tool that helps caregivers, community health volunteers, and health officers understand malnutrition risk across all 47 counties of Kenya.

**How to access it:**
Open any of these URLs in your browser:
- **https://kmal.vercel.app** (short URL)
- **https://malnutrition-kenya.vercel.app** (descriptive URL)

**System requirements:**
- A smartphone, tablet, or computer with an internet connection
- A modern browser (Chrome, Firefox, Safari, or Edge — version 2023 or newer)
- No login or account required

---

## Using the Interactive Map

The home page shows a full-country map of Kenya with all 47 counties.

### Zooming and Panning
- **Zoom in**: Scroll up with your mouse wheel, or pinch out on a touchscreen
- **Zoom out**: Scroll down, or pinch in
- **Pan**: Click and drag the map in any direction
- **Reset view**: Use the zoom controls (+ / − buttons) in the top-left corner

### Switching Data Layers
Above the map, you'll see 5 buttons representing different data layers:
1. **🧮 Predicted Cases** — ML-predicted acute malnutrition cases
2. **📏 Stunting Rate** — % of under-5s who are stunted (chronic)
3. **⚖️ Wasting Rate** — % of under-5s who are wasted (acute)
4. **💧 Water Access** — % with improved water sources
5. **💰 Poverty Rate** — % below the poverty line

Click any button to switch what the map colours show. The legend at the bottom updates automatically.

### Exploring a County
1. **Hover** over any county to see its name and the active metric value in a tooltip
2. **Click** a county to open its detail view below the map
3. The detail view shows:
   - 6 key indicators (predicted cases, stunting, wasting, under-5 population, water access, poverty rate)
   - Sub-county disaggregation (variation within the county)
   - The "why" behind malnutrition — drivers, a family's story, local initiatives, and success stories
4. Click **"Open full map"** at the top-right for the full exploration page

### Turning on Live Mode
Click the **"Live"** button (top-right of the map) to refresh data every 30 seconds. A green pulsing dot indicates live mode is active. The timestamp shows when data was last refreshed.

### Labels Toggle
Check the **"Labels"** box to show county name + value markers directly on the map. Uncheck to hide them for a cleaner view.

---

## Assessing a Child's Risk

The **Assess** page (`/assess`) lets you check a child's malnutrition risk in seconds — no login required.

### Step-by-step

1. Navigate to **Assess** (in the top navigation bar, or click the clipboard icon)
2. Fill in the form:
   - **Age (months)**: the child's age in months (6-60)
   - **Sex**: male or female
   - **Weight (kg)**: measured weight in kilograms
   - **Height (cm)**: measured height or length in centimeters
   - **MUAC (mm)**: mid-upper arm circumference (optional but highly recommended — if you have a MUAC tape, measure it)
   - **Food groups (last 24h)**: count how many of these 7 food groups the child ate: grains, legumes, dairy, eggs, meat/fish, vegetables, fruit (0-7)
   - **Meals per day**: number of meals in the last 24 hours
   - **Illness in last 2 weeks**: check the box if the child had diarrhoea, fever, or respiratory illness
   - **Currently breastfeeding**: check if applicable (especially for under-2s)
   - **Caregiver education**: select the highest level of education
   - **Improved water source**: select "Yes" if your household has piped water, a borehole, or treated water; "No" if you use river, pond, or unprotected sources
3. Click **"Assess Risk"**
4. The result appears on the right side immediately

### Understanding the result

The result shows:
- **Risk level banner**: colour-coded (green = normal, yellow = moderate, orange = high, red = severe)
- **WHO Z-Scores**: three numbers (WHZ, HAZ, WAZ) with colour coding:
  - **Weight-for-Height (WHZ)**: measures wasting (acute malnutrition)
  - **Height-for-Age (HAZ)**: measures stunting (chronic malnutrition)
  - **Weight-for-Age (WAZ)**: measures underweight
  - **Interpretation**: z-score < -3 = severe, -3 to -2 = moderate, > -2 = normal
- **Findings**: plain-language explanation of each measurement
- **Recommendations**: actionable next steps based on the risk level

### ⚠️ Important — when to seek immediate help
If the result shows **"Severe Acute Malnutrition (SAM)"** with a red banner:
- **Seek medical attention immediately** at the nearest health facility
- The child needs therapeutic feeding (RUTF — Ready-to-Use Therapeutic Food)
- Do not delay — SAM is life-threatening

### Privacy
All calculations happen **in your browser** — nothing is sent to a server or stored. Use a pseudonym if you want to track the same child over time; do not enter the child's real name.

---

## Subscribing to Alerts

The **Alerts** page (`/alerts`) lets you receive notifications when county risk levels change.

### Email alerts
1. Go to **Alerts** in the navigation bar
2. Enter your email address
3. Select the counties you want to monitor (leave empty for all 47)
4. Click **Subscribe**
5. You'll receive an email whenever a selected county's risk level changes

### Browser push notifications
1. On the Alerts page, find the **"Browser push notifications"** section
2. Click **"Enable"**
3. Your browser will ask for permission — click **"Allow"**
4. You'll receive desktop notifications instantly when alerts fire

### Dismissing alerts
Each alert card has an **✕** button in the top-right — click it to dismiss that specific alert from your view.

---

## Reading County Stories

Each county on the map has a **narrative panel** with 4 sections:

1. **Why is malnutrition prevalent here?** — the social, economic, and environmental drivers
2. **A Family's Story** — a representative composite testimony (not a real individual — used to make the data relatable)
3. **Local Initiatives & Programs** — real NGOs and government programs operating in that county
4. **Progress & Success** — a documented success milestone

To read a county's story: click the county on the map, then scroll down to the narrative panel.

---

## Asking Questions

The **Q&A** page (`/qa`) has 10 frequently-asked questions about childhood malnutrition and the prediction system.

- **Search**: type a keyword in the search box to filter questions
- **Expand**: click any question to expand its answer
- **Ask your own**: scroll to the bottom and submit a question — our team responds within 3 working days

---

## Sharing Your Story

The **Share a Story** page (`/stories`) lets you share your experience with childhood malnutrition.

### How to submit
1. Go to **Stories** in the navigation
2. Fill in the form:
   - **Your name (or pseudonym)**: use a first name or pseudonym — not your real full name
   - **County**: select your county
   - **Your role**: e.g., mother, community health volunteer, health officer
   - **Story title**: a short headline
   - **Your story**: 2-6 paragraphs
3. Check the **consent box** confirming the story is yours and does not contain identifiable details of real children
4. Click **Submit Story**

### Privacy protection
- ⚠️ Do **not** include real names of children or identifiable medical details
- Stories are reviewed by our team within 5 working days
- We may edit for clarity before publishing
- Names/counties are attributed as you submitted them

---

## Troubleshooting

### The map doesn't load
- Check your internet connection
- Try refreshing the page
- The map tiles load from OpenStreetMap — if it's slow, wait a few seconds

### The assessment form doesn't show a result
- Make sure all required fields (marked with *) are filled
- Check that weight and height are positive numbers
- Ensure age is between 6 and 60 months

### Push notifications don't work
- Check that your browser supports notifications (Chrome, Firefox, Safari, Edge)
- If you previously blocked notifications, go to your browser's site settings and re-allow them
- Some browsers require HTTPS — our site is always HTTPS

### The site is slow on mobile
- Try switching to a WiFi connection
- Close other browser tabs
- The map is the heaviest feature — other pages load faster

### Need more help?
Email: **team@malnutrition-project.org**

---

*This manual is for caregivers, community health volunteers, and family members. For system administrator documentation, see [ADMIN_MANUAL.md](./ADMIN_MANUAL.md).*
