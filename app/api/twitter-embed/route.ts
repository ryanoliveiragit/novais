import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    // Use Twitter's oEmbed API to get the embed HTML
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&theme=dark&dnt=true&omit_script=true`;

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch embed from Twitter');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Twitter embed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter embed' },
      { status: 500 }
    );
  }
}
