export const bodyparser = (req: any, callback: any) => {
  let body: string = '';

  req.on('data', (chunk: string) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    callback(body);
  });
}