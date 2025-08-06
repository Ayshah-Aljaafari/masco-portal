const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
  secret: 'replace-with-a-secure-secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
});

app.post('/api/login', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ error: 'Missing credentials' });
  }
  req.session.user = { username, role };
  res.json({ redirect: role === 'admin' ? '/admin.html' : '/request.html' });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/') && !req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

let requests = [];
let nextId = 1;

app.post('/api/requests', (req, res) => {
  const { equipment, other, quantity, justification } = req.body;
  if (!equipment || !quantity || !justification) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newRequest = {
    id: nextId++,
    equipment,
    other: other || '',
    quantity: parseInt(quantity, 10),
    justification,
    status: 'Pending',
    created_at: new Date().toISOString(),
    employee: req.session.user.username
  };
  requests.push(newRequest);
  res.json(newRequest);
});

app.get('/api/my-requests', (req, res) => {
  const mine = requests.filter(r => r.employee === req.session.user.username);
  res.json(mine);
});

app.get('/api/requests', (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(requests);
});

app.post('/api/requests/:id/approved', (req, res) => {
  if (req.session.user.role !== 'admin') return res.sendStatus(403);
  const r = requests.find(r => r.id === +req.params.id);
  if (!r) return res.sendStatus(404);
  r.status = 'Approved';
  res.json(r);
});

app.post('/api/requests/:id/rejected', (req, res) => {
  if (req.session.user.role !== 'admin') return res.sendStatus(403);
  const r = requests.find(r => r.id === +req.params.id);
  if (!r) return res.sendStatus(404);
  r.status = 'Rejected';
  res.json(r);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
