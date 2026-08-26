function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function isServiceRoleKey(key) {
  if (!key || typeof key !== 'string') return false;
  var parts = key.split('.');
  if (parts.length < 2) return false;
  try {
    var padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (padded.length % 4) padded += '=';
    var payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    return payload && payload.role === 'service_role';
  } catch (err) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  var supabaseUrl = process.env.SUPABASE_URL;
  var anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('public-config: missing SUPABASE_URL or SUPABASE_ANON_KEY');
    sendJson(res, 500, { error: 'Configuração indisponível.' });
    return;
  }

  if (isServiceRoleKey(anonKey)) {
    console.error('public-config: SUPABASE_ANON_KEY looks like a service role key');
    sendJson(res, 500, { error: 'Configuração indisponível.' });
    return;
  }

  sendJson(res, 200, {
    supabaseUrl: String(supabaseUrl).replace(/\/$/, ''),
    supabaseAnonKey: anonKey
  });
};
