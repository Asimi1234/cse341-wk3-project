const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: GitHub OAuth authentication
 */

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Start the GitHub OAuth login flow
 *     tags: [Auth]
 *     description: Redirects the browser to GitHub to authorize the app. Open this in a browser, not the Swagger "Try it out" button.
 *     responses:
 *       302:
 *         description: Redirect to GitHub for authorization
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     description: GitHub redirects here after authorization. Creates the session and redirects to the API docs on success.
 *     responses:
 *       302:
 *         description: Redirect to /api-docs on success or /auth/status on failure
 */
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/status' }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out and destroy the session
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to /auth/status after logging out
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/auth/status');
    });
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check current authentication state
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Whether a user is logged in, and their info if so
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loggedIn:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ loggedIn: true, user: req.user });
  }
  return res.status(200).json({ loggedIn: false, user: null });
});

module.exports = router;
