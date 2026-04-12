import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, enquiry, message } = body;

    // Validate the required fields
    if (!name || !email || !enquiry || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("enquiries")
      .insert([
        {
          name,
          email,
          phone,
          enquiry_type: enquiry,
          message,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting contact:", error);
      return NextResponse.json(
        { error: "Failed to submit contact form" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Contact form submitted successfully", data },
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
