(function (window) {
  var clientPromise = null;

  function loadConfig() {
    return fetch('/api/public-config', {
      method: 'GET',
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('config');
      return res.json();
    }).then(function (cfg) {
      if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
        throw new Error('config');
      }
      return cfg;
    });
  }

  function getClient() {
    if (clientPromise) return clientPromise;

    clientPromise = loadConfig().then(function (cfg) {
      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        throw new Error('sdk');
      }
      return window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          storage: window.localStorage
        }
      });
    });

    return clientPromise;
  }

  function getSession() {
    return getClient().then(function (client) {
      return client.auth.getSession();
    }).then(function (result) {
      if (result.error) throw result.error;
      return result.data && result.data.session ? result.data.session : null;
    });
  }

  function requireAuth() {
    return getSession().then(function (session) {
      if (!session) {
        window.location.replace('/login/');
        return null;
      }
      return session;
    }).catch(function () {
      window.location.replace('/login/');
      return null;
    });
  }

  function signIn(email, password) {
    return getClient().then(function (client) {
      return client.auth.signInWithPassword({
        email: email,
        password: password
      });
    });
  }

  function signOut() {
    return getClient().then(function (client) {
      return client.auth.signOut();
    }).catch(function () {
      return null;
    }).then(function () {
      window.location.replace('/login/');
    });
  }

  window.IWAuth = {
    getClient: getClient,
    getSession: getSession,
    requireAuth: requireAuth,
    signIn: signIn,
    signOut: signOut
  };
})(window);
