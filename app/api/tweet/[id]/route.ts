import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tweetId = params.id;
  
  try {
    // Você precisará de um Bearer Token do Twitter API v2
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweet data');
    }

    const data = await response.json();
    
    // Formatar os números
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    return NextResponse.json({
      views: formatNumber(data.data.public_metrics.impression_count || 0),
      likes: formatNumber(data.data.public_metrics.like_count || 0),
      retweets: formatNumber(data.data.public_metrics.retweet_count || 0),
      replies: formatNumber(data.data.public_metrics.reply_count || 0),
    });
  } catch (error) {
    console.error('Error fetching tweet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tweet data' },
      { status: 500 }
    );
  }
}
