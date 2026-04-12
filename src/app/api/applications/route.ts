import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;
    const resume = formData.get("resume") as File | null;

    // Validate the required fields
    if (!name || !email || !role || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ID = uuidv4();

    let resumePath = null;
    let resumeSize = null;
    let resumeType = null;

    // Upload the resume to Supabase Storage if it exists
    if (resume && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      const extension = resume.name.split(".").pop() || "pdf";
      const fileName = `${ID}.${extension}`;
      const storagePath = `${fileName}`;

      const { data: uploadData, error: uploadError } =
        await supabaseAdmin.storage
          .from("resumes")
          .upload(storagePath, buffer, {
            contentType: resume.type,
            upsert: true,
          });

      if (uploadError) {
        console.error("Error uploading resume:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload resume" },
          { status: 500 },
        );
      }

      resumePath = uploadData.fullPath;
      resumeSize = resume.size;
      resumeType = resume.type;
    }

    // Insert into the join_our_team table
    const { data, error } = await supabaseAdmin
      .from("join_our_team")
      .insert([
        {
          id: ID,
          name,
          email,
          phone,
          applied_for: role,
          resume_path: resumePath,
          resume_size: resumeSize,
          resume_type: resumeType,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting application:", error);
      // Optional: Cleanup the uploaded file if database insert fails
      return NextResponse.json(
        { error: "Failed to submit application form" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Application submitted successfully", data },
      { status: 201 },
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
