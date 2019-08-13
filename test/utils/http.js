export const mockResponse200 = body => () =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' }
  });
