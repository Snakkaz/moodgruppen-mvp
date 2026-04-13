import { NextRequest, NextResponse } from "next/server";

// n8n/Make Workflow API — demo endpoint for workflow management
// Ready for real n8n integration when instance is set up

interface Workflow {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  trigger: string;
  lastRun?: string;
  runs: number;
}

const DEMO_WORKFLOWS: Workflow[] = [
  {
    id: "wf-1",
    name: "Innholdspipeline — Automatisk",
    status: "active",
    trigger: "Webhook / Manuell",
    lastRun: new Date().toISOString(),
    runs: 12,
  },
  {
    id: "wf-2",
    name: "Ny kunde → Kundeprofil + Brief",
    status: "active",
    trigger: "CRM-oppdatering",
    lastRun: new Date(Date.now() - 86400000).toISOString(),
    runs: 5,
  },
  {
    id: "wf-3",
    name: "Ukentlig SEO-rapport",
    status: "active",
    trigger: "Cron — Mandager 09:00",
    runs: 8,
  },
  {
    id: "wf-4",
    name: "Sosiale medier — Auto-publisering",
    status: "inactive",
    trigger: "Etter innholdsgenerering",
    runs: 0,
  },
];

export async function GET() {
  return NextResponse.json({
    provider: "n8n",
    status: "connected",
    workflows: DEMO_WORKFLOWS,
    stats: {
      totalWorkflows: DEMO_WORKFLOWS.length,
      activeWorkflows: DEMO_WORKFLOWS.filter(w => w.status === "active").length,
      totalRuns: DEMO_WORKFLOWS.reduce((s, w) => s + w.runs, 0),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { action, workflowId } = await req.json();
    if (action === "trigger") {
      return NextResponse.json({
        success: true,
        message: `Workflow ${workflowId} trigget.`,
        executionId: `exec-${Date.now()}`,
      });
    }
    return NextResponse.json({ error: "Ukjent handling." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel." }, { status: 400 });
  }
}
