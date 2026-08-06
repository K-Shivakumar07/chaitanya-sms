import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible@1";
import { convertToModelMessages, streamText, type UIMessage } from "npm:ai@5";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function buildContext(semester: number) {
  const [subjects, syllabus, timetable, materials, notes, assignments, announcements, activities, deadlines] =
    await Promise.all([
      supabase.from("subjects").select("code,name,short_name,faculty,credits,kind").eq("semester", semester),
      supabase.from("syllabus_units").select("unit_no,title,topics,hours,subject_id").eq("semester", semester),
      supabase.from("timetable_slots").select("day,start_time,end_time,subject_name,faculty,room,is_lab")
        .eq("semester", semester).order("day_order").order("start_time"),
      supabase.from("materials").select("title,subject_name,unit_no,file_type,size_label,uploaded_at,description").eq("semester", semester),
      supabase.from("notes").select("title,subject_name,unit_no,faculty,pages,uploaded_at").eq("semester", semester),
      supabase.from("assignments").select("title,subject_name,description,faculty,assigned_date,due_date,status,priority").eq("semester", semester),
      supabase.from("announcements").select("title,body,category,posted_by,posted_at").eq("semester", semester).order("posted_at", { ascending: false }),
      supabase.from("activities").select("kind,title,detail,occurred_at").eq("semester", semester).order("occurred_at", { ascending: false }).limit(15),
      supabase.from("deadlines").select("title,detail,category,due_date,urgent").eq("semester", semester).order("due_date"),
    ]);

  const subjectList = subjects.data ?? [];

  const syllabusBySubject = subjectList.map((s) => {
    const units = (syllabus.data ?? []).filter(() => true);
    return { subject: s.name, short: s.short_name, faculty: s.faculty, units };
  });

  return {
    subjects: subjectList,
    syllabus: (syllabus.data ?? []).length,
    syllabusUnits: syllabus.data ?? [],
    syllabusBySubject: syllabusBySubject.length,
    timetable: timetable.data ?? [],
    materials: materials.data ?? [],
    notes: notes.data ?? [],
    assignments: assignments.data ?? [],
    announcements: announcements.data ?? [],
    activities: activities.data ?? [],
    deadlines: deadlines.data ?? [],
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, semester, student } = (await req.json()) as {
      messages: UIMessage[];
      semester: number;
      student?: { name?: string; rollNo?: string; branch?: string };
    };

    if (!semester) {
      return new Response(JSON.stringify({ error: "Semester is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ctx = await buildContext(semester);
    const now = new Date();
    const today = DAY_NAMES[now.getDay()];
    const tomorrow = DAY_NAMES[(now.getDay() + 1) % 7];

    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const system = `You are the Campus Assistant, a personal academic AI assistant inside a B.Tech Student Management System.

STUDENT: ${student?.name ?? "Student"} (${student?.rollNo ?? "roll number unknown"}, ${student?.branch ?? "B.Tech"})
ACTIVE SEMESTER: Semester ${semester}
TODAY: ${today}, ${now.toDateString()} (tomorrow is ${tomorrow})

You must answer ONLY using the Semester ${semester} data below. Never invent classes, faculty, files or dates. If something is not in the data, say it is not available for this semester.

Rules:
- Be concise, friendly and student-focused. Use markdown: short headings, bullet lists, and tables for timetables.
- Understand follow-up questions using earlier turns (for example "who teaches the second subject?" refers to the previously listed classes).
- For "today"/"tomorrow" questions use the day names above. There are no classes on Sunday.
- When listing assignments, mention subject, due date and status. Flag overdue and urgent items.
- When the student asks for notes, materials or syllabus, list the exact titles that exist and point them to the matching dashboard page (Study Materials, Notes & PDFs, Syllabus, Timetable, Assignments, Announcements).
- For summary questions ("what should I do today?"), combine today's classes, pending assignments and upcoming deadlines.

=== SUBJECTS ===
${JSON.stringify(ctx.subjects)}

=== SYLLABUS UNITS ===
${JSON.stringify(ctx.syllabusUnits)}

=== TIMETABLE (Monday to Saturday) ===
${JSON.stringify(ctx.timetable)}

=== STUDY MATERIALS ===
${JSON.stringify(ctx.materials)}

=== NOTES & PDFS ===
${JSON.stringify(ctx.notes)}

=== ASSIGNMENTS ===
${JSON.stringify(ctx.assignments)}

=== ANNOUNCEMENTS ===
${JSON.stringify(ctx.announcements)}

=== RECENT ACTIVITY ===
${JSON.stringify(ctx.activities)}

=== UPCOMING DEADLINES ===
${JSON.stringify(ctx.deadlines)}`;

    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system,
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({ headers: corsHeaders });
  } catch (error) {
    console.error("campus-ai error", error);
    const message = error instanceof Error ? error.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
