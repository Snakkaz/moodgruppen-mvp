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

export const CHANNEL_COLORS: Record<string, string> = {
  "Instagram Post": "bg-pink-500/15 text-pink-400 border-pink-500/20",
  "LinkedIn Post": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Facebook Ad": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Google Ads": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Blogginnlegg": "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export function generateDemoContent(client: Client, channel: string, brief: string): string {
  const t = client.tone.toLowerCase();

  const templates: Record<string, (c: Client, b: string) => string> = {
    "Instagram Post": (c, b) =>
`${b}

${c.name} hjelper ${c.audience || "kunder"} med å oppnå bedre resultater innen ${c.industry.toLowerCase()}.

Vi tror på ${t === "formell" ? "kvalitet og tillit" : t === "leken" ? "kreativitet og glede" : "resultater og innsikt"}. Derfor jobber vi hver dag for å levere løsninger som faktisk gjør en forskjell.

${t === "formell" ? "Ta kontakt for en uforpliktende samtale." : "Nysgjerrig? Send oss en melding!"}

#${c.industry.replace(/\s/g, "")} #${c.name.replace(/\s/g, "")} #digital #markedsføring #innhold`,

    "LinkedIn Post": (c, b) =>
`${b}

I ${c.industry.toLowerCase()} ser vi stadig nye muligheter for de som tenker fremover. Hos ${c.name} jobber vi med ${c.audience || "våre kunder"} for å skape varig verdi.

Tre ting vi har lært:

→ Kundeinnsikt slår magefølelse
→ Konsistens bygger tillit over tid
→ Resultater starter med strategi, ikke taktikk

${t === "formell" ? "Vi inviterer til dialog om hvordan vi kan styrke deres posisjon." : "Hva er deres erfaring? Del gjerne i kommentarene."}`,

    "Facebook Ad": (c, b) =>
`${c.name} | ${b}

Er du ${c.audience || "en som"} vil ha ${t === "formell" ? "pålitelige resultater" : "bedre resultater uten å bruke mer tid"}?

Vi i ${c.name} har hjulpet hundrevis innen ${c.industry.toLowerCase()} med å nå målene sine.

${t === "autoritativ" ? "Dokumenterte resultater. Ingen tomme løfter." : "Prøv oss — du har ingenting å tape."}

[Les mer] [Ta kontakt]`,

    "Google Ads": (c, b) =>
`Overskrift 1: ${c.name} — ${c.industry}
Overskrift 2: ${b}
Overskrift 3: ${t === "formell" ? "Pålitelig partner" : "Se resultatene selv"}

Beskrivelse 1: ${c.name} leverer profesjonelle løsninger til ${c.audience || "sine kunder"}. ${t === "formell" ? "Kontakt oss i dag." : "Kom i gang nå."}
Beskrivelse 2: Resultater innen ${c.industry.toLowerCase()} starter her. ${c.name} hjelper deg hele veien.

Visnings-URL: ${c.name.toLowerCase().replace(/\s/g, "")}.no`,

    "Blogginnlegg": (c, b) =>
`# ${b}

*Publisert av ${c.name} — for ${c.audience || "våre lesere"}*

## Innledning

I en tid der ${c.industry.toLowerCase()} er i rask endring, er det viktigere enn noensinne å holde seg oppdatert. ${c.name} har over tid bygget solid kompetanse på dette feltet, og i denne artikkelen deler vi våre erfaringer.

## Utfordringen

Mange ${c.audience || "i bransjen"} opplever at de bruker for mye tid på feil ting. Konkurransen øker, kundenes forventninger stiger, og marginene krymper. Spørsmålet er ikke om man må tilpasse seg — men hvor raskt.

## Vår tilnærming

Hos ${c.name} tror vi på ${t === "formell" ? "evidensbaserte strategier" : t === "leken" ? "kreative løsninger med et smil" : "datadrevne beslutninger"}. Det betyr:

- **Analysere før man handler** — forstå situasjonen før man investerer
- **Teste og lære** — små eksperimenter gir store innsikter
- **Skalere det som fungerer** — doble ned på vinnerne

## Neste steg

${t === "formell" ? "Vi inviterer til en uforpliktende samtale om hvordan vi kan støtte deres virksomhet." : "Nysgjerrig? Ta kontakt så tar vi en prat over en kaffe."}

---
*${c.name} — ${c.industry}*`
  };

  const gen = templates[channel];
  return gen ? gen(client, brief) : `Innhold for ${channel}: ${brief}\n\nTilpasset ${client.name} (${client.industry}).`;
}
