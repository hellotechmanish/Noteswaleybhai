import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let url = searchParams.get("url"); // university homepage

  if (!url) {
    return NextResponse.json(
      { error: "University URL is required" },
      { status: 400 }
    );
  }

  // Auto-detect course page
  const possiblePaths = [
    "",
    "/courses",
    "/academics",
    "/programs",
    "/departments",
    "/admissions",
  ];

  let finalHTML = "";
  let finalURL = "";

  // Try multiple URLs until we find valid page
  for (const path of possiblePaths) {
    try {
      const fullURL = url.replace(/\/$/, "") + path;
      const html = await fetch(fullURL).then((r) => r.text());

      if (html.length > 5000) {
        finalHTML = html;
        finalURL = fullURL;
        break;
      }
    } catch (err) {}
  }

  if (!finalHTML) {
    return NextResponse.json(
      { error: "No valid course page found" },
      { status: 404 }
    );
  }

  const $ = cheerio.load(finalHTML);
  let courses: string[] = [];

  // STRONG selectors
  $("li, a, p, span, h3, h4, table td").each((i, el) => {
    const text = $(el).text().trim();

    if (
      text.match(
        /(B\.?Sc|BA|BCom|BCA|BBA|BTech|MTech|MBA|MCA|MA|MSc|PhD|Diploma|PG Diploma)/i
      )
    ) {
      if (!courses.includes(text)) courses.push(text);
    }
  });

  return NextResponse.json({ source: finalURL, courses });
}
