var ALLOWED_ORIGINS = [
  'https://identidadeweb.com',
  'https://www.identidadeweb.com',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500'
];

var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var CONTACT_FIELDS = 'id,name,phone,source,created_at';

function setCors(req, res) {
  var origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function unauthorized(res) {
  sendJson(res, 401, { error: 'Não autorizado.' });
}

function getBearerToken(req) {
  var header = req.headers.authorization || '';
  if (typeof header !== 'string') return '';
  var parts = header.replace(/^\s+|\s+$/g, '').split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return '';
  return parts[1] || '';
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

function parseJsonBody(raw) {
  if (!raw) return {};
  return JSON.parse(raw);
}

function publicContact(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    source: row.source,
    created_at: row.created_at
  };
}

function validateName(value) {
  var name = typeof value === 'string' ? value.replace(/^\s+|\s+$/g, '') : '';
  if (!name || name.length > 100) return null;
  return name;
}

function validatePhone(value) {
  if (typeof value !== 'string' || !/^[0-9]{11}$/.test(value)) return null;
  return value;
}

function validateId(value) {
  if (typeof value !== 'string' || !UUID_RE.test(value)) return null;
  return value;
}

function restUrl(supabaseUrl, path) {
  return String(supabaseUrl).replace(/\/$/, '') + path;
}

function serviceHeaders(serviceKey, prefer) {
  var headers = {
    apikey: serviceKey,
    Authorization: 'Bearer ' + serviceKey,
    'Content-Type': 'application/json'
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function validateAccessToken(supabaseUrl, serviceKey, token) {
  var response = await fetch(restUrl(supabaseUrl, '/auth/v1/user'), {
    method: 'GET',
    headers: {
      apikey: serviceKey,
      Authorization: 'Bearer ' + token
    }
  });
  return response.ok;
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'PATCH' &&
    req.method !== 'DELETE'
  ) {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  var token = getBearerToken(req);
  if (!token) {
    unauthorized(res);
    return;
  }

  var supabaseUrl = process.env.SUPABASE_URL;
  var serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error('crm api: missing Supabase env');
    sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
    return;
  }

  try {
    var isAuthed = await validateAccessToken(supabaseUrl, serviceKey, token);
    if (!isAuthed) {
      unauthorized(res);
      return;
    }
  } catch (err) {
    console.error('crm api: auth validation failed');
    sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
    return;
  }

  var endpoint = restUrl(supabaseUrl, '/rest/v1/contacts');

  try {
    if (req.method === 'GET') {
      var listRes = await fetch(
        endpoint + '?select=' + CONTACT_FIELDS + '&order=created_at.desc',
        {
          method: 'GET',
          headers: serviceHeaders(serviceKey)
        }
      );
      if (!listRes.ok) {
        var listDetail = await listRes.text();
        console.error('crm api: list failed', listRes.status, listDetail);
        sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
        return;
      }
      var rows = await listRes.json();
      sendJson(res, 200, Array.isArray(rows) ? rows.map(publicContact) : []);
      return;
    }

    var raw;
    try {
      raw = await readBody(req);
    } catch (err) {
      sendJson(res, 400, { error: 'Não foi possível concluir a operação.' });
      return;
    }

    var data;
    try {
      data = parseJsonBody(raw);
    } catch (err) {
      sendJson(res, 400, { error: 'Não foi possível concluir a operação.' });
      return;
    }

    if (req.method === 'POST') {
      var name = validateName(data.name);
      var phone = validatePhone(data.phone);
      if (!name) {
        sendJson(res, 400, { error: 'Nome é obrigatório.' });
        return;
      }
      if (!phone) {
        sendJson(res, 400, { error: 'Telefone inválido.' });
        return;
      }

      var createRes = await fetch(endpoint, {
        method: 'POST',
        headers: serviceHeaders(serviceKey, 'return=representation'),
        body: JSON.stringify({
          name: name,
          phone: phone,
          source: 'Manual'
        })
      });
      if (!createRes.ok) {
        var createDetail = await createRes.text();
        console.error('crm api: insert failed', createRes.status, createDetail);
        sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
        return;
      }
      var created = await createRes.json();
      var createdRow = Array.isArray(created) ? created[0] : created;
      sendJson(res, 201, publicContact(createdRow));
      return;
    }

    var id = validateId(data.id);
    if (!id) {
      sendJson(res, 400, { error: 'Contato inválido.' });
      return;
    }

    if (req.method === 'PATCH') {
      var nextName = validateName(data.name);
      var nextPhone = validatePhone(data.phone);
      if (!nextName) {
        sendJson(res, 400, { error: 'Nome é obrigatório.' });
        return;
      }
      if (!nextPhone) {
        sendJson(res, 400, { error: 'Telefone inválido.' });
        return;
      }

      var patchRes = await fetch(endpoint + '?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH',
        headers: serviceHeaders(serviceKey, 'return=representation'),
        body: JSON.stringify({
          name: nextName,
          phone: nextPhone
        })
      });
      if (!patchRes.ok) {
        var patchDetail = await patchRes.text();
        console.error('crm api: update failed', patchRes.status, patchDetail);
        sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
        return;
      }
      var patched = await patchRes.json();
      var patchedRow = Array.isArray(patched) ? patched[0] : patched;
      if (!patchedRow) {
        sendJson(res, 400, { error: 'Contato inválido.' });
        return;
      }
      sendJson(res, 200, publicContact(patchedRow));
      return;
    }

    var deleteRes = await fetch(endpoint + '?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: serviceHeaders(serviceKey, 'return=representation')
    });
    if (!deleteRes.ok) {
      var deleteDetail = await deleteRes.text();
      console.error('crm api: delete failed', deleteRes.status, deleteDetail);
      sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
      return;
    }
    var deleted = await deleteRes.json();
    var deletedRow = Array.isArray(deleted) ? deleted[0] : deleted;
    if (!deletedRow) {
      sendJson(res, 400, { error: 'Contato inválido.' });
      return;
    }
    sendJson(res, 200, { success: true });
  } catch (err) {
    console.error('crm api: unexpected error');
    sendJson(res, 500, { error: 'Não foi possível concluir a operação.' });
  }
};
