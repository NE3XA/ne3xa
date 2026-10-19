/**
 * Nexa Dev — localStorage data layer
 * Keys are namespaced so they do not clash with the public cart.
 */
(function (global) {
  'use strict';

  var PREFIX = 'nexa_dev_';
  var KEYS = {
    products: PREFIX + 'products',
    exams: PREFIX + 'exams',
    notes: PREFIX + 'notes',
    papers: PREFIX + 'papers',
    site: PREFIX + 'site'
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  /* ---------- Default seed data ---------- */
  var defaultProducts = [
    {
      id: 'lp-001',
      name: 'NE3XA ProBook 14',
      brand: 'NE3XA',
      category: 'business',
      processor: 'Intel Core i5-1335U',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" FHD IPS',
      os: 'Windows 11 Pro',
      price: 899,
      stock: 12,
      image: '../images/laptop-1.svg',
      description: 'Reliable business laptop for everyday productivity.'
    },
    {
      id: 'lp-005',
      name: 'NE3XA Student 15',
      brand: 'NE3XA',
      category: 'student',
      processor: 'Intel Core i3-1215U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '15.6" FHD',
      os: 'Windows 11 Home',
      price: 499,
      stock: 22,
      image: '../images/laptop-5.svg',
      description: 'Affordable laptop designed for students.'
    }
  ];

  var defaultExams = [
    {
      id: 'html-css',
      title: 'HTML & CSS Final',
      minutes: 30,
      description: 'Structure, semantics and modern layout.',
      questions: [
        { q: 'Which element is best for the main page heading?', opts: ['<h1>', '<header>', '<title>', '<strong>'], a: 0 }
      ]
    }
  ];

  var defaultNotes = [
    {
      id: 'note-html',
      title: 'HTML quick notes',
      language: 'HTML',
      body: 'Use semantic tags: header, main, nav, article, footer.\nAlways provide alt text on images.',
      updated: new Date().toISOString()
    }
  ];

  var defaultPapers = [
    {
      id: 'paper-html',
      title: 'HTML & CSS Practice Paper',
      language: 'HTML/CSS',
      body: 'NE3XA practice paper\n1. Main page heading element?\n2. What does CSS stand for?',
      updated: new Date().toISOString()
    }
  ];

  var defaultSite = {
    companyName: 'NE3XA',
    tagline: 'Technology built for how you work.',
    email: 'hello@ne3xa.example',
    phone: '+256 700 000 000',
    whatsapp: '+256 700 000 000',
    address: 'Kampala, Uganda',
    hours: 'Mon–Fri, 9:00–17:00 EAT'
  };

  function ensureSeed() {
    if (localStorage.getItem(KEYS.products) == null) write(KEYS.products, defaultProducts);
    if (localStorage.getItem(KEYS.exams) == null) write(KEYS.exams, defaultExams);
    if (localStorage.getItem(KEYS.notes) == null) write(KEYS.notes, defaultNotes);
    if (localStorage.getItem(KEYS.papers) == null) write(KEYS.papers, defaultPapers);
    if (localStorage.getItem(KEYS.site) == null) write(KEYS.site, defaultSite);
  }

  ensureSeed();

  var store = {
    keys: KEYS,
    uid: uid,

    getProducts: function () { return read(KEYS.products, []); },
    saveProducts: function (list) { write(KEYS.products, list); },
    upsertProduct: function (product) {
      var list = store.getProducts();
      var i = list.findIndex(function (p) { return p.id === product.id; });
      if (i >= 0) list[i] = product;
      else list.push(product);
      store.saveProducts(list);
      return list;
    },
    deleteProduct: function (id) {
      var list = store.getProducts().filter(function (p) { return p.id !== id; });
      store.saveProducts(list);
      return list;
    },

    getExams: function () { return read(KEYS.exams, []); },
    saveExams: function (list) { write(KEYS.exams, list); },
    upsertExam: function (exam) {
      var list = store.getExams();
      var i = list.findIndex(function (e) { return e.id === exam.id; });
      if (i >= 0) list[i] = exam;
      else list.push(exam);
      store.saveExams(list);
      return list;
    },
    deleteExam: function (id) {
      var list = store.getExams().filter(function (e) { return e.id !== id; });
      store.saveExams(list);
      return list;
    },

    getNotes: function () { return read(KEYS.notes, []); },
    saveNotes: function (list) { write(KEYS.notes, list); },
    upsertNote: function (note) {
      note.updated = new Date().toISOString();
      var list = store.getNotes();
      var i = list.findIndex(function (n) { return n.id === note.id; });
      if (i >= 0) list[i] = note;
      else list.push(note);
      store.saveNotes(list);
      return list;
    },
    deleteNote: function (id) {
      var list = store.getNotes().filter(function (n) { return n.id !== id; });
      store.saveNotes(list);
      return list;
    },

    getPapers: function () { return read(KEYS.papers, []); },
    savePapers: function (list) { write(KEYS.papers, list); },
    upsertPaper: function (paper) {
      paper.updated = new Date().toISOString();
      var list = store.getPapers();
      var i = list.findIndex(function (p) { return p.id === paper.id; });
      if (i >= 0) list[i] = paper;
      else list.push(paper);
      store.savePapers(list);
      return list;
    },
    deletePaper: function (id) {
      var list = store.getPapers().filter(function (p) { return p.id !== id; });
      store.savePapers(list);
      return list;
    },

    getSite: function () { return read(KEYS.site, defaultSite); },
    saveSite: function (data) { write(KEYS.site, data); },

    exportAll: function () {
      return {
        products: store.getProducts(),
        exams: store.getExams(),
        notes: store.getNotes(),
        papers: store.getPapers(),
        site: store.getSite(),
        exportedAt: new Date().toISOString()
      };
    },
    importAll: function (data) {
      if (data.products) store.saveProducts(data.products);
      if (data.exams) store.saveExams(data.exams);
      if (data.notes) store.saveNotes(data.notes);
      if (data.papers) store.savePapers(data.papers);
      if (data.site) store.saveSite(data.site);
    },
    resetAll: function () {
      write(KEYS.products, defaultProducts);
      write(KEYS.exams, defaultExams);
      write(KEYS.notes, defaultNotes);
      write(KEYS.papers, defaultPapers);
      write(KEYS.site, defaultSite);
    }
  };

  global.NexaDev = store;
})(window);
