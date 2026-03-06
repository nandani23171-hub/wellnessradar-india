const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

async function test() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-4b-it:free',
        messages: [{
          role: 'user',
          content: 'You are a D2C analyst. Analyze "Berberine" for Indian market. Respond ONLY with valid JSON (no backticks): {"verdictReason":"2 sentences","signal":"2 sentences","gap":"2 sentences","opportunity":"2 sentences with price","whyTrending":"2-3 sentences why trending in India","whyDeclining":"null","fadReason":"null","indianConsumerSegment":"2-3 sentences specific Indian consumer segment","competitors":[{"name":"Indian brand name","priceRange":"Rs.XXX-XXX","strength":"strength","weakness":"weakness"}],"consumerQuestions":["q1?","q2?","q3?"]}'
        }]
      })
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    console.log('RAW:', text);
    try {
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      console.log('\nPARSED OK!');
      console.log('competitors:', JSON.stringify(parsed.competitors));
      console.log('whyTrending:', parsed.whyTrending);
      console.log('indianConsumerSegment:', parsed.indianConsumerSegment);
    } catch(e) {
      console.log('\nPARSE FAILED:', e.message);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}
test();
