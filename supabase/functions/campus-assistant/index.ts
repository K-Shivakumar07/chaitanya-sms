import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MODEL = "google/gemini-3.6-flash";

const fmt = (rows: unknown[]) => JSON.stringify(rows);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const semester = Number(body?.semester);
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      return new Response(JSON.stringify({ error: "Invalid semester" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const [subjects, syllabus, timetable, materials, notes, assignments, announcements, deadlines, activities] =
      await Promise.all([
        supabase.from("subjects").select("code,name,short_name,faculty,credits,kind").eq("semester", semester),
        supabase.from("syllabus_units").select("unit_no,title,topics,hours,subject_id").eq("semester", semester).order("unit_no"),
        supabase.from("timetable_slots").select("day,day_order,start_time,end_time,subject_name,faculty,room,is_lab").eq("semester", semester).order("day_order").order("start_time"),
        supabase.from("materials").select("title,subject_name,unit_no,file_type,size_label,uploaded_at,downloads,description").eq("semester", semester),
        supabase.from("notes").select("title,subject_name,unit_no,faculty,file_type,pages,size_label,uploaded_at").eq("semester", semester),
        supabase.from("assignments").select("title,subject_name,faculty,description,assigned_date,due_date,status,priority").eq("semester", semester).order("due_date"),
        supabase.from("announcements").select("title,body,category,posted_by,posted_at").or(`semester.eq.${semester},semester.is.null`).order("posted_at", { ascending: false }).limit(20),
        supabase.from("deadlines").select("title,detail,category,due_date,urgent").eq("semester", semester).order("due_date"),
        supabase.from("activities").select("kind,title,detail,occurred_at").eq("semester", semester).order("occurred_at", { ascending: false }).limit(15),
      ]);

    const subjectById = new Map<string, string>();
    // map syllabus subject ids to names using a second lookup
    const { data: subjectRows } = await supabase
      .from("subjects")
      .select("id,name")
      .eq("semester", semester);
    (subjectRows ?? []).forEach((s: { id: string; name: string }) => subjectById.set(s.id, s.name));

    const to12 = (t: string) => {
      const [hStr, mStr] = String(t ?? "").split(":");
      const h = Number(hStr);
      if (Number.isNaN(h)) return t;
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${String(Number(mStr ?? 0)).padStart(2, "0")} ${period}`;
    };
    const timetableRows = (timetable.data ?? []).map((s: Record<string, unknown>) => ({
      ...s,
      start_time: to12(String(s.start_time)),
      end_time: to12(String(s.end_time)),
    }));

    const syllabusWithNames = (syllabus.data ?? []).map((u: Record<string, unknown>) => ({
      subject: subjectById.get(String(u.subject_id)) ?? "Unknown",
      unit: u.unit_no,
      title: u.title,
      topics: u.topics,
      hours: u.hours,
    }));

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const todayName = now.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

    const assignmentRows = assignments.data ?? [];
    const pending = assignmentRows.filter((a: Record<string, string>) => a.status !== "submitted");
    const completed = assignmentRows.filter((a: Record<string, string>) => a.status === "submitted");
    const todaysClasses = timetableRows.filter((s: Record<string, string>) => s.day === todayName);

    const system = `You are the Campus Assistant for a B.Tech student management dashboard.
You answer ONLY from the semester ${semester} dashboard data given below. Today is ${today} (${todayName}).

Rules:
- Answer briefly and clearly using markdown-free plain text with simple bullet lines ("• ").
- For timetable questions (e.g. "what are Monday classes?"), list time, subject, faculty and room in order. Always state times in 12-hour format with AM/PM exactly as given.
- For assignments give title, subject, due date and status. For deadlines mention urgency.
- For syllabus questions list the units and their topics for that subject.
- If something is not in the data, say it is not available for this semester. Never invent data.

=== DASHBOARD SNAPSHOT (Semester ${semester}) ===
TODAY (${todayName}) CLASSES: ${fmt(todaysClasses)}
STATS: today's classes = ${todaysClasses.length}, pending assignments = ${pending.length}, completed assignments = ${completed.length}, study materials = ${(materials.data ?? []).length}, notes = ${(notes.data ?? []).length}
SUBJECTS: ${fmt(subjects.data ?? [])}
FULL TIMETABLE: ${fmt(timetableRows)}
SYLLABUS UNITS: ${fmt(syllabusWithNames)}
STUDY MATERIALS: ${fmt(materials.data ?? [])}
NOTES: ${fmt(notes.data ?? [])}
ASSIGNMENTS: ${fmt(assignmentRows)}
UPCOMING DEADLINES: ${fmt(deadlines.data ?? [])}
ANNOUNCEMENTS: ${fmt(announcements.data ?? [])}
RECENT ACTIVITY: ${fmt(activities.data ?? [])}
=== END SNAPSHOT ===`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: "system", content: system },
          ...messages.slice(-12).map((m: { role: string; content: string }) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: String(m.content ?? "").slice(0, 4000),
          })),
        ],
      }),
    });

    if (!aiResponse.ok) {
      const detail = await aiResponse.text();
      return new Response(JSON.stringify({ error: detail }), {
        status: aiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResponse.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
