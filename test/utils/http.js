export const mockResponse200 = body => () =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' },
  });

export const mockResponse404 = () =>
  new Response('nope', {
    status: 404,
    headers: { 'Content-type': 'text/html' },
  });
