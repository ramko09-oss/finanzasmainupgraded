import express from 'express';
import path from 'node:path';

// Registrar después de la API para servir una única SPA, sin ocultar sus errores.
export function serveFrontend(app, directory) {
  app.get(['/react', '/react/*'], (req, res) => res.redirect(308, '/'));
  app.use(express.static(directory));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || path.extname(req.path)) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    res.sendFile(path.join(directory, 'index.html'));
  });
}
