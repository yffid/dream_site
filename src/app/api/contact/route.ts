import { createClient } from '@supabase/supabase-js';
import { contactFormSchema } from '@/lib/validations/contact-form';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await rateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const data = await request.json();

    // Validate form data
    const validatedData = contactFormSchema.parse(data);

    // Additional spam checks
    const spamTriggers = [
      { field: 'website', value: validatedData.website },
      { field: 'timestamp', value: Date.now() - validatedData.timestamp < 2000 }, // Too fast submission
      { field: 'message', value: /https?:\/\//i.test(validatedData.message) }, // Contains URLs
      { field: 'message', value: /<[a-z][\s\S]*>/i.test(validatedData.message) }, // Contains HTML
    ];

    const spamDetected = spamTriggers.some(({ value }) => value);

    if (spamDetected) {
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Check for existing submissions from this email
    const { count } = await supabase
      .from('contacts')
      .select('id', { count: 'exact' })
      .eq('email', validatedData.email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (count && count > 3) {
      return NextResponse.json(
        { error: 'Too many submissions from this email' },
        { status: 429 }
      );
    }

    // Insert into database
    const { error } = await supabase
      .from('contacts')
      .insert([{
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        message: validatedData.message,
        ip_address: ip, // Store for rate limiting
        user_agent: request.headers.get('user-agent') || '',
      }]);

    if (error) throw error;

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
