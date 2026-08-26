var ALLOWED_ORIGINS = [
  'https://identidadeweb.com',
  'https://www.identidadeweb.com',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500'
];

function setCors(req, res) {
  var origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var size = 0;
    req.on('data', function (chunk) {
      size += chunk.length;
      if (size > 4096) {
        reject(new Error('payload-too-large'));
        req.destroy();
        return;
      }
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', function () {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  var raw;
  try {
    raw = await readBody(req);
  } catch (err) {
    sendJson(res, 400, { error: 'Nome é obrigatório.' });
    return;
  }

  var data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (err) {
    sendJson(res, 400, { error: 'Nome é obrigatório.' });
    return;
  }

  var name = typeof data.name === 'string' ? data.name.replace(/^\s+|\s+$/g, '') : '';
  var phone = typeof data.phone === 'string' ? data.phone : '';
  var source = typeof data.source === 'string' ? data.source.replace(/^\s+|\s+$/g, '') : '';

  if (!name) {
    sendJson(res, 400, { error: 'Nome é obrigatório.' });
    return;
  }
  if (name.length > 100) {
    sendJson(res, 400, { error: 'Nome é obrigatório.' });
    return;
  }

  if (!/^[0-9]{11}$/.test(phone)) {
    sendJson(res, 400, { error: 'Telefone inválido.' });
    return;
  }

  if (source !== 'Bob' && source !== 'Manual') {
    sendJson(res, 400, { error: 'Origem inválida.' });
    return;
  }

  var supabaseUrl = process.env.SUPABASE_URL;
  var serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('contact api: missing Supabase env');
    sendJson(res, 500, { error: 'Não foi possível salvar o contato.' });
    return;
  }

  var endpoint = String(supabaseUrl).replace(/\/$/, '') + '/rest/v1/contacts';

  try {
    var response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: 'Bearer ' + serviceKey,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        source: source
      })
    });

    if (!response.ok) {
      var detail = await response.text();
      console.error('contact api: supabase insert failed', response.status, detail);
      sendJson(res, 500, { error: 'Não foi possível salvar o contato.' });
      return;
    }

    sendJson(res, 201, { success: true });
  } catch (err) {
    console.error('contact api: unexpected error', err);
    sendJson(res, 500, { error: 'Não foi possível salvar o contato.' });
  }
};
