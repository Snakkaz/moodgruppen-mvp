# Moodgruppen MVP — AI Content Pipeline

## Hva dette er
En AI-drevet content pipeline for markedsfoeringsbyraer. Kunden (byraet) limer inn en brief,
velger kanal (SoMe, blog, Google Ads), og faar ferdige innholdsforslag med tone-of-voice tilpasset kundens merkevare.

## Hvorfor dette
Moodgruppen har 3 selskaper: Mood Communication (mediestrategi), Nettrafikk (digital/SEO/Ads), Smood Social (SoMe/influencer).
Alle produserer innhold daglig for mange kunder. En AI-pipeline som forstaar kundens merkevare og genererer
foerste-utkast sparer timer per dag.

## MVP-scope (demo)
- Next.js app med mork, profesjonell UI
- Dashboard: legg inn kunde-profil (navn, bransje, tone-of-voice, maalgruppe)
- Content Generator: velg kanal -> AI genererer innhold tilpasset kunden
- Kanaler: Instagram post, LinkedIn post, Facebook ad, Google Ads tekst, Blogginnlegg
- Vis generert innhold med "kopier" og "rediger" knapper
- Historikk over generert innhold
- VIKTIG: Bruk OpenAI API (eller simuler) for generering
- Hostinger: Deployes til Vercel eller demo-url

## Tech stack
- Next.js 14+ (App Router)
- Tailwind CSS (mork tema)
- SQLite eller JSON for demo-data (ingen tung database)
- OpenAI API for innholdsgenerering (bruk GITHUB_TOKEN som fallback)
- Deployes pa Vercel

## Design
- Mork tema, profesjonelt (som Moodgruppens egen stil)
- Rent, minimalt, fokus paa funksjon
- Ingen emojier eller AI-pynt
- Responsive

## Filstruktur
```
moodgruppen-mvp/
  app/
    layout.tsx
    page.tsx (dashboard)
    clients/page.tsx (kunde-profiler)
    generate/page.tsx (innholdsgenerering)
    history/page.tsx (historikk)
  components/
    Sidebar.tsx
    ContentCard.tsx
    GenerateForm.tsx
    ClientForm.tsx
  lib/
    ai.ts (OpenAI-integrasjon)
    store.ts (JSON-basert lagring)
  public/
```

## Viktige detaljer
- Demo skal FUNGERE - ikke bare vaere mockup
- Slavisa som sendte mailen jobber med Analyse & KI
- De vil se at Stian kan gaa fra tanke til noe konkret
- Tone: profesjonell, ikke over-engineered, men imponerende
