import http from 'http';
import { arrData } from './utils/const';
import { bodyparser } from './middlewares/bodyparser';

const { PORT = 3002 } = process.env;

const server = http.createServer((req: any, res: any) => {
  if(req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': 'origin, content-type, accept'
    }).end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.setHeader('Content-Type', 'application/json');

  if(req.url === '/info' && req.method === 'POST') {
    setTimeout(() => {
      bodyparser(req, (body: string) => {
        try {
          const data: any = JSON.parse(body);

          const email: string = data['email'];
          const number: string = data['number'];

          if(!email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 'message': 'Email является обязательным полем.' }));
            return;
          }
          if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ 'message': 'Введен некорректный email.' }));
            return;
          }
          if(number) {
            if(number.length > 6) {
              res.statusCode = 400;
              res.end(JSON.stringify({ 'message': 'Длина номера не может превышать 6-и символов.' }));
              return;
            }
            if(!/^[0-9]+$/.test(number)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ 'message': 'Введен некорректный номер.' }));
              return;
            }
          }

          let search: any;

          if(email && number) {
            search = arrData.filter(i => i.email === email && i.number === number);
          } else if(email) {
            search = arrData.filter(i => i.email === email);
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ 'info': search }));
        } catch(err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ 'message': 'Произошла непредвиденная ошибка.' }));
        }
      });
    }, 5000);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ 'message': 'Маршрут не найден.' }));
  }
});

server.listen(PORT);
