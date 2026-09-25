/**
 * Nexa Dev — shared UI helpers
 */
(function (global) {
  'use strict';

  function toast(message, type) {
    var el = document.getElementById('dev-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dev-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove('show');
    }, 2600);
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function openModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('open');
  }

  function closeModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.remove('open');
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  }

  function setActiveNav() {
    var path = location.pathname.split('/').pop() || 'index.html';
    qsa('.dev-nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === path || href.endsWith(path));
    });
  }

  document.addEventListener('DOMContentLoaded', setActiveNav);

  global.DevUI = {
    toast: toast,
    qs: qs,
    qsa: qsa,
    openModal: openModal,
    closeModal: closeModal,
    escapeHtml: escapeHtml,
    formatDate: formatDate
  };
})(window);
