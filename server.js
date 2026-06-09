// ══════════════════════════════════════════════════════
//  ABOUDEV PLATFORM v1.0 — Backend API
//  Diomandé Abou Johan — Aboudev Labs © 2026
// ══════════════════════════════════════════════════════

const express = require('express');
const cors    = require('cors');
const crypto  = require('crypto');
const path    = require('path');
const https   = require('https');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ════════════════════════════════════════════
//  FIREBASE CONFIG
// ════════════════════════════════════════════
const FIREBASE_URL = process.env.FIREBASE_URL || 'https://aboudev-platform-default-rtdb.firebaseio.com';

async function fbGet(p) {
  return new Promise((resolve) => {
    https.get(`${FIREBASE_URL}/${p}.json`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(null); } });
    }).on('error', () => resolve(null));
  });
}

async function fbSet(p, val) {
  return new Promise((resolve) => {
    const body = JSON.stringify(val);
    const u    = new URL(`${FIREBASE_URL}/${p}.json`);
    const opts = { hostname:u.hostname, path:u.pathname, method:'PUT', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)} };
    const req  = https.request(opts, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', () => resolve(null));
    req.write(body); req.end();
  });
}

async function fbPush(p, val) {
  return new Promise((resolve) => {
    const body = JSON.stringify(val);
    const u    = new URL(`${FIREBASE_URL}/${p}.json`);
    const opts = { hostname:u.hostname, path:u.pathname, method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)} };
    const req  = https.request(opts, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', () => resolve(null));
    req.write(body); req.end();
  });
}

async function fbDelete(p) {
  return new Promise((resolve) => {
    const u    = new URL(`${FIREBASE_URL}/${p}.json`);
    const opts = { hostname:u.hostname, path:u.pathname, method:'DELETE' };
    const req  = https.request(opts, () => resolve(true));
    req.on('error', () => resolve(false));
    req.end();
  });
}

// ════════════════════════════════════════════
//  DONNÉES INITIALES
// ════════════════════════════════════════════
const ADMIN = {
  id:            'admin-aboudev',
  nom:           'Diomandé Abou Johan',
  email:         'daboujohan@gmail.com',
  password_hash: crypto.createHash('sha256').update('aboudev2026').digest('hex'),
  role:          'admin',
  date_creation: '2026-06-01T00:00:00.000Z'
};

const PROJETS_INITIAUX = [
  {
    id: 'viteapi-v21',
    nom: 'VITE API',
    description_courte: 'Sandbox de paiement mobile pour développeurs africains',
    description: 'VITE API est une API de paiement sandbox qui simule Wave CI, Orange Money, Moov Money et MTN Mobile Money. Idéale pour tester l\'intégration de paiement dans n\'importe quelle application avant de passer en production.',
    type: 'API',
    version: '2.1.0',
    technologies: ['Node.js', 'Express', 'Firebase'],
    fonctionnalites: ['4 opérateurs mobiles CI', 'Dashboard développeur', 'Firebase persistant', 'Webhook', 'Email automatique', 'Rate limiting'],
    lien_demo: 'https://viteapi.onrender.com',
    lien_github: 'https://github.com/daboujohan-hub/viteapi',
    telechargements: 0,
    vues: 0,
    statut: 'actif',
    featured: true,
    date_publication: '2026-05-30T00:00:00.000Z',
    versions: [
      { version: '1.0.0', date: '2026-05-30', notes: 'Version initiale — 4 opérateurs sandbox' },
      { version: '2.0.0', date: '2026-05-31', notes: 'Firebase + Sécurité + Webhook + Rate limiting' },
      { version: '2.1.0', date: '2026-06-01', notes: 'Email automatique via Resend' }
    ]
  },
  {
    id: 'mathwin-ci-v1',
    nom: 'MathWin CI',
    description_courte: 'Jeu de maths mobile où les joueurs gagnent de l\'argent réel',
    description: 'MathWin CI est un jeu de mathématiques pour les joueurs ivoiriens. Résolvez des opérations, gagnez des points, et convertissez-les en FCFA via Wave, Orange Money, Moov ou MTN.',
    type: 'Jeu Web',
    version: '1.0.0',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'VITE API'],
    fonctionnalites: ['Jeu de maths', 'Système de points', 'Paiement Wave/Orange/Moov/MTN', 'Tournoi 1v1', 'Bonus quotidien'],
    lien_demo: 'https://mathwin-ci.netlify.app',
    lien_github: 'https://github.com/daboujohan-hub/mathwin-ci',
    telechargements: 0,
    vues: 0,
    statut: 'actif',
    featured: true,
    date_publication: '2026-05-01T00:00:00.000Z',
    versions: [
      { version: '1.0.0', date: '2026-05-01', notes: 'Version initiale avec paiement VITE API' }
    ]
  },
  {
    id: 'livreci-v1',
    nom: 'LivreCI',
    description_courte: 'Plateforme e-commerce et livraison pour la Côte d\'Ivoire',
    description: 'LivreCI est une plateforme de commerce en ligne dédiée à la Côte d\'Ivoire. Commandez des produits locaux et recevez-les rapidement avec un système de suivi en temps réel.',
    type: 'E-commerce',
    version: '1.0.0',
    technologies: ['React Native', 'Firebase', 'CinetPay'],
    fonctionnalites: ['Catalogue produits', 'Paiement mobile CI', 'Suivi livraison', 'Notifications push'],
    lien_demo: '',
    lien_github: 'https://github.com/daboujohan-hub/livreci',
    telechargements: 0,
    vues: 0,
    statut: 'actif',
    featured: false,
    date_publication: '2026-04-01T00:00:00.000Z',
    versions: [
      { version: '1.0.0', date: '2026-04-01', notes: 'Version initiale' }
    ]
  }
];

async function initDB() {
  try {
    const admin = await fbGet('users/admin-aboudev');
    if (!admin) {
      await fbSet('users/admin-aboudev', ADMIN);
      console.log('✅ Admin créé dans Firebase');
    }
    const projets = await fbGet('projets');
    if (!projets) {
      for (const p of PROJETS_INITIAUX) {
        await fbSet(`projets/${p.id}`, p);
      }
      console.log('✅ Projets initiaux créés dans Firebase');
    }
    await fbSet('stats', {
      visiteurs: 0, utilisateurs: 0,
      telechargements: 0, messages: 0,
      derniere_maj: new Date().toISOString()
    });
  } catch(e) {
    console.log('⚠️ Firebase non accessible');
  }
}

// ════════════════════════════════════════════
//  RATE LIMITING
// ════════════════════════════════════════════
const rlMap = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!rlMap.has(ip)) { rlMap.set(ip, {count:1, start:now}); return next(); }
  const r = rlMap.get(ip);
  if (now - r.start > 60000) { rlMap.set(ip, {count:1, start:now}); return next(); }
  r.count++;
  if (r.count > 100) return res.status(429).json({ erreur: 'Trop de requêtes.' });
  next();
}
app.use(rateLimit);

// ════════════════════════════════════════════
//  AUTH ADMIN
// ════════════════════════════════════════════
async function authAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ erreur: 'Token admin requis.' });
  const users = await fbGet('users');
  if (!users) return res.status(401).json({ erreur: 'Non autorisé.' });
  const admin = Object.values(users).find(u => u.role === 'admin' && u.token === token);
  if (!admin) return res.status(401).json({ erreur: 'Token invalide.' });
  req.admin = admin;
  next();
}

// ════════════════════════════════════════════
//  ROUTES PUBLIQUES
// ════════════════════════════════════════════
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'index.html')));
app.get('/catalogue', (req,res) => res.sendFile(path.join(__dirname,'catalogue.html')));
app.get('/admin', (req,res) => res.sendFile(path.join(__dirname,'admin.html')));

// Statut API
app.get('/api/v1', (req,res) => res.json({
  plateforme: 'AbouDev Platform',
  version: '1.0.0',
  statut: '✅ En ligne',
  auteur: 'Diomandé Abou Johan',
  message: 'Bienvenue sur AbouDev Platform 🇨🇮'
}));

// ── Tous les projets
app.get('/api/v1/projets', async (req,res) => {
  const projets = await fbGet('projets');
  if (!projets) return res.json({ projets: [] });
  const liste = Object.values(projets)
    .filter(p => p.statut === 'actif')
    .sort((a,b) => new Date(b.date_publication) - new Date(a.date_publication));
  res.json({ total: liste.length, projets: liste });
});

// ── Un projet par ID + incrémenter vues
app.get('/api/v1/projets/:id', async (req,res) => {
  const projet = await fbGet(`projets/${req.params.id}`);
  if (!projet) return res.status(404).json({ erreur: 'Projet introuvable.' });
  projet.vues = (projet.vues || 0) + 1;
  await fbSet(`projets/${req.params.id}`, projet);
  res.json(projet);
});

// ── Téléchargement
app.post('/api/v1/projets/:id/telecharger', async (req,res) => {
  const projet = await fbGet(`projets/${req.params.id}`);
  if (!projet) return res.status(404).json({ erreur: 'Projet introuvable.' });
  projet.telechargements = (projet.telechargements || 0) + 1;
  await fbSet(`projets/${req.params.id}`, projet);
  const stats = await fbGet('stats') || {};
  stats.telechargements = (stats.telechargements || 0) + 1;
  await fbSet('stats', stats);
  res.json({ succes: true, telechargements: projet.telechargements });
});

// ── Stats publiques
app.get('/api/v1/stats', async (req,res) => {
  const stats   = await fbGet('stats') || {};
  const projets = await fbGet('projets') || {};
  const users   = await fbGet('users') || {};
  res.json({
    visiteurs:       stats.visiteurs || 0,
    utilisateurs:    Object.values(users).filter(u => u.role === 'user').length,
    telechargements: stats.telechargements || 0,
    projets:         Object.values(projets).filter(p => p.statut === 'actif').length,
    messages:        stats.messages || 0
  });
});

// ── Inscription utilisateur
app.post('/api/v1/inscription', async (req,res) => {
  const { nom, email, password } = req.body;
  if (!nom || !email || !password) return res.status(400).json({ erreur: 'Champs requis : nom, email, password' });
  const users = await fbGet('users') || {};
  if (Object.values(users).find(u => u.email === email))
    return res.status(400).json({ erreur: 'Email déjà utilisé.' });
  const id = 'user-' + Date.now();
  const user = {
    id, nom, email,
    password_hash: crypto.createHash('sha256').update(password).digest('hex'),
    role: 'user', favoris: [],
    date_creation: new Date().toISOString()
  };
  await fbSet(`users/${id}`, user);
  res.status(201).json({ succes: true, message: '✅ Compte créé !', nom: user.nom });
});

// ── Connexion
app.post('/api/v1/connexion', async (req,res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ erreur: 'Email et mot de passe requis.' });
  const users = await fbGet('users') || {};
  const user  = Object.values(users).find(u => u.email === email);
  if (!user) return res.status(404).json({ erreur: 'Compte introuvable.' });
  if (user.password_hash !== crypto.createHash('sha256').update(password).digest('hex'))
    return res.status(401).json({ erreur: 'Mot de passe incorrect.' });
  const token = crypto.randomBytes(24).toString('hex');
  user.token  = token;
  await fbSet(`users/${user.id}`, user);
  res.json({ succes: true, token, nom: user.nom, role: user.role, email: user.email });
});

// ── Contact / Message
app.post('/api/v1/contact', async (req,res) => {
  const { nom, email, sujet, message } = req.body;
  if (!nom || !email || !message) return res.status(400).json({ erreur: 'Champs requis : nom, email, message' });
  const id  = 'msg-' + Date.now();
  const msg = { id, nom, email, sujet: sujet||'Sans sujet', message, lu: false, date: new Date().toISOString() };
  await fbSet(`messages/${id}`, msg);
  const stats = await fbGet('stats') || {};
  stats.messages = (stats.messages || 0) + 1;
  await fbSet('stats', stats);
  res.json({ succes: true, message: '✅ Message envoyé ! Nous vous répondrons bientôt.' });
});

// ════════════════════════════════════════════
//  ROUTES ADMIN
// ════════════════════════════════════════════

// ── Login admin
app.post('/api/v1/admin/login', async (req,res) => {
  const { email, password } = req.body;
  const users = await fbGet('users') || {};
  const admin = Object.values(users).find(u => u.role === 'admin' && u.email === email);
  if (!admin) return res.status(401).json({ erreur: 'Accès refusé.' });
  if (admin.password_hash !== crypto.createHash('sha256').update(password).digest('hex'))
    return res.status(401).json({ erreur: 'Mot de passe incorrect.' });
  const token = crypto.randomBytes(24).toString('hex');
  admin.token = token;
  await fbSet(`users/${admin.id}`, admin);
  res.json({ succes: true, token, nom: admin.nom });
});

// ── Ajouter projet
app.post('/api/v1/admin/projets', authAdmin, async (req,res) => {
  const { nom, description_courte, description, type, version, technologies, fonctionnalites, lien_demo, lien_github } = req.body;
  if (!nom || !description_courte) return res.status(400).json({ erreur: 'nom et description_courte requis.' });
  const id = nom.toLowerCase().replace(/\s+/g,'-') + '-v' + (version||'1.0').replace(/\./g,'');
  const projet = {
    id, nom, description_courte, description: description||'',
    type: type||'Autre', version: version||'1.0.0',
    technologies: technologies||[], fonctionnalites: fonctionnalites||[],
    lien_demo: lien_demo||'', lien_github: lien_github||'',
    telechargements: 0, vues: 0, statut: 'actif', featured: false,
    date_publication: new Date().toISOString(), versions: []
  };
  await fbSet(`projets/${id}`, projet);
  res.status(201).json({ succes: true, projet });
});

// ── Modifier projet
app.put('/api/v1/admin/projets/:id', authAdmin, async (req,res) => {
  const projet = await fbGet(`projets/${req.params.id}`);
  if (!projet) return res.status(404).json({ erreur: 'Projet introuvable.' });
  const updated = { ...projet, ...req.body, id: projet.id };
  await fbSet(`projets/${req.params.id}`, updated);
  res.json({ succes: true, projet: updated });
});

// ── Supprimer projet
app.delete('/api/v1/admin/projets/:id', authAdmin, async (req,res) => {
  await fbDelete(`projets/${req.params.id}`);
  res.json({ succes: true, message: 'Projet supprimé.' });
});

// ── Lire messages
app.get('/api/v1/admin/messages', authAdmin, async (req,res) => {
  const msgs = await fbGet('messages') || {};
  const liste = Object.values(msgs).sort((a,b) => new Date(b.date)-new Date(a.date));
  res.json({ total: liste.length, messages: liste });
});

// ── Marquer message comme lu
app.put('/api/v1/admin/messages/:id/lu', authAdmin, async (req,res) => {
  const msg = await fbGet(`messages/${req.params.id}`);
  if (!msg) return res.status(404).json({ erreur: 'Message introuvable.' });
  msg.lu = true;
  await fbSet(`messages/${req.params.id}`, msg);
  res.json({ succes: true });
});

// ── Lire utilisateurs
app.get('/api/v1/admin/users', authAdmin, async (req,res) => {
  const users = await fbGet('users') || {};
  const liste = Object.values(users)
    .filter(u => u.role === 'user')
    .map(u => ({ id:u.id, nom:u.nom, email:u.email, date_creation:u.date_creation }));
  res.json({ total: liste.length, utilisateurs: liste });
});

// ── Stats admin complètes
app.get('/api/v1/admin/stats', authAdmin, async (req,res) => {
  const stats   = await fbGet('stats') || {};
  const projets = await fbGet('projets') || {};
  const users   = await fbGet('users') || {};
  const msgs    = await fbGet('messages') || {};
  const projetsList = Object.values(projets);
  const plusPopulaire = projetsList.sort((a,b) => b.telechargements - a.telechargements)[0];
  res.json({
    visiteurs:        stats.visiteurs || 0,
    utilisateurs:     Object.values(users).filter(u=>u.role==='user').length,
    telechargements:  stats.telechargements || 0,
    projets_actifs:   projetsList.filter(p=>p.statut==='actif').length,
    messages_total:   Object.keys(msgs).length,
    messages_non_lus: Object.values(msgs).filter(m=>!m.lu).length,
    projet_populaire: plusPopulaire ? { nom:plusPopulaire.nom, telechargements:plusPopulaire.telechargements } : null
  });
});

// ── 404
app.use((req,res) => res.status(404).json({ erreur: 'Route introuvable.' }));

// ════════════════════════════════════════════
//  DÉMARRAGE
// ════════════════════════════════════════════
app.listen(PORT, async () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     ABOUDEV PLATFORM v1.0 — ONLINE       ║
  ║     Diomandé Abou Johan © 2026  🇨🇮       ║
  ╠══════════════════════════════════════════╣
  ║  URL  : http://localhost:${PORT}            ║
  ╚══════════════════════════════════════════╝
  `);
  await initDB();
});
