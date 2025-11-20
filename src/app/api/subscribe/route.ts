// app/api/subscribe/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to KahaaniBot!',
            text: `Thank you for subscribing, ${email}! You'll now receive our updates.`,
            html: `<h1>Welcome!</h1><p>Thank you for subscribing, <b>${email}</b>! You'll now receive our storytelling updates.</p>`,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Subscription successful and email sent' }, { status: 200 });
    } catch (error) {
        console.error('Subscription API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}