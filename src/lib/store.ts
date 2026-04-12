// Types and helpers for the MVP
export interface Client {
  id: string;
  name: string;
  industry: string;
  tone: string;
  audience: string;
  guidelines: string;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  clientId: string;
  clientName: string;
  channel: string;
  brief: string;
  content: string;
  createdAt: string;
}

export const TONES = ["Formell", "Uformell", "Profesjonell", "Leken", "Autoritativ"] as const;
export const CHANNELS = ["Instagram Post", "LinkedIn Post", "Facebook Ad", "Google Ads", "Blogginnlegg"] as const;

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("mg-clients") || "[]");
}
export function saveClients(c: Client[]) {
  localStorage.setItem("mg-clients", JSON.stringify(c));
}
export function getHistory(): ContentItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("mg-history") || "[]");
}
export function saveHistory(h: ContentItem[]) {
  localStorage.setItem("mg-history", JSON.stringify(h));
}

// Realistic demo content generator (no API needed)
export function generateDemoContent(client: Client, channel: string, brief: string): string {
  const t = client.tone.toLowerCase();
  const style = t === "formell" ? "et profesjonelt og tillitsvekkende" : t === "leken" ? "et engasjerende og vennlig" : t === "autoritativ" ? "et kunnskapsrikt og overbevisende" : "et naturlig og direkte";

  const templates: Record<string, (c: Client, b: string) => string> = {
    "Instagram Post": (c, b) =>
`${b}

${c.name} hjelper ${c.audience} med aa oppnaa bedre resultater innen ${c.industry.toLowerCase()}.

Vi tror paa ${t === "formell" ? "kvalitet og tillit" : t === "leken" ? "kreativitet og glede" : "resultater og innsikt"}. Derfor jobber vi hver dag for aa levere losninger som faktisk gjoer en forskjell.

${t === "formell" ? "Ta kontakt for en uforpliktende samtale." : "Nysgjerrig? Send oss en melding!"}

#${c.industry.replace(/\s/g,"")} #${c.name.replace(/\s/g,"")} #digital #innhold`,

    "LinkedIn Post": (c, b) =>
`${b}

I ${c.industry.toLowerCase()} ser vi stadig nye muligheter for de som tenker fremover. Hos ${c.name} jobber vi med ${c.audience} for aa skape varig verdi.

Tre ting vi har laert:
- Kundeinnsikt slaar magefølelse
- Konsistens bygger tillit over tid
- Resultater starter med strategi, ikke taktikk

${t === "formell" ? "Vi inviterer til dialog om hvordan vi kan styrke deres posisjon." : "Hva er deres erfaring? Del gjerne i kommentarene."}`,

    "Facebook Ad": (c, b) =>
`${c.name} | ${b}

Er du ${c.audience} som vil ha ${t === "formell" ? "palitelige resultater" : "bedre resultater uten aa bruke mer tid"}?

Vi i ${c.name} har hjulpet hundrevis innen ${c.industry.toLowerCase()} med aa naa maalene sine.

${t === "autoritativ" ? "Dokumenterte resultater. Ingen tomme lovnader." : "Prøv oss — du har ingenting aa tape."}

[Les mer] [Ta kontakt]`,

    "Google Ads": (c, b) =>
`Overskrift 1: ${c.name} — ${c.industry}
Overskrift 2: ${b}
Overskrift 3: ${t === "formell" ? "Palitelig partner" : "Se resultatene selv"}

Beskrivelse 1: ${c.name} leverer ${style} tilbud til ${c.audience}. ${t === "formell" ? "Kontakt oss i dag." : "Kom i gang na."}
Beskrivelse 2: Resultater innen ${c.industry.toLowerCase()} starter her. ${c.name} hjelper deg hele veien.

Visnings-URL: ${c.name.toLowerCase().replace(/\s/g,"")}.no/${b.toLowerCase().split(" ").slice(0,2).join("-")}`,

    "Blogginnlegg": (c, b) =>
`# ${b}

*Publisert av ${c.name} — for ${c.audience}*

## Innledning

I en tid der ${c.industry.toLowerCase()} er i rask endring, er det viktigere enn noensinne aa holde seg oppdatert. ${c.name} har over tid bygget solid kompetanse paa dette feltet, og i denne artikkelen deler vi vaare erfaringer.

## Utfordringen

Mange ${c.audience} opplever at de bruker for mye tid paa feil ting. Konkurransen oker, kundenes forventninger stiger, og marginene krymper. Sporsmalet er ikke om man maa tilpasse seg — men hvor raskt.

## Vaar tilnaerming

Hos ${c.name} tror vi paa ${t === "formell" ? "evidensbaserte strategier" : t === "leken" ? "kreative losninger med et smil" : "datadrevne beslutninger"}. Det betyr:

- **Analysere foer man handler** — forstaa situasjonen foer man investerer
- **Teste og laere** — smaa eksperimenter gir store innsikter
- **Skalere det som fungerer** — dobbel ned paa vinnere

## Resultater

Vaare kunder innen ${c.industry.toLowerCase()} har sett ${t === "autoritativ" ? "dokumenterte forbedringer paa 20-40% paa kjerneomraadene" : "merkbare forbedringer allerede etter foerste maaned"}.

## Neste steg

${t === "formell" ? "Vi inviterer til en uforpliktende samtale om hvordan vi kan stotte deres virksomhet." : "Nysgjerrig? Ta kontakt sa tar vi en prat over en kaffe."}

---
*${c.name} — ${c.industry}*`
  };

  const gen = templates[channel];
  return gen ? gen(client, brief) : `Innhold for ${channel}: ${brief}\n\nTilpasset ${client.name} (${client.industry}) med ${style} tone rettet mot ${client.audience}.`;
}
