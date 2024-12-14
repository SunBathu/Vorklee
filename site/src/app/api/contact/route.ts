export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Example: Log the data (replace with your email service or database logic)
    console.log('Received contact form submission:', { name, email, message });

    return new Response('Message received', { status: 200 });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
