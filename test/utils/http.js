export async function mockResponse200(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-type': 'application/json' }
  });
}
