import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, category, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a detailed message (at least 10 characters).' },
        { status: 400 }
      );
    }

    const inquiryRecord = {
      id: `inq_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      category: category || 'General Travel Inquiry',
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || 'Unknown',
    };

    console.log('[ExplorePakur Contact Form Inquiry]:', JSON.stringify(inquiryRecord, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for reaching out to Explore Pakur! Your inquiry has been received. Our regional tourism assistance team will contact you within 24 hours.',
        inquiryId: inquiryRecord.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try reaching us directly via email at contact@explorepakur.in.' },
      { status: 500 }
    );
  }
}
