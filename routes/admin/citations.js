var express, router, Event;

express = require('express');
router = express.Router();

var moment = require('moment');
//moment.locale("de");

utils = require('../../utils/AdminUtils');

Citation = require('../../models/citation');

defaultCitation = {
  words: 'Über Generationen hinweg wurden Erfahrungen im Weinbau weitergegeben, ebenso wie Qualitätsbewusstsein und die Liebe zum Wein. ',
  author: 'Janina Imhof, Oenologin in Ausbildung',
};

// List events
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Citation.find(function (err, citations) {
    if (err) {
      next(err)
    }
    else {
      return res.render('admin/citations/modify', {
        active: { citations: true },
        citation: (citations && citations.length > 0 ? citations[ 0 ] : defaultCitation),
      });
    }
  });
});

router.post('/modify', function (req, res, next) {
  // Update existing event
  if (!req.body.words || !req.body.author) {
    return next(new Error('Bitte geben Sie Wörter und Autor ein!'));
  }
  Citation.findOne({}, function (err, citation) {
    if (err) {
      return next(err)
    }
    if (!citation) {
      // New Event
      citation = new Citation({
        words: req.body.words.trim(),
        author: req.body.author.trim(),
      });
    } else {
      citation.words = req.body.words.trim();
      citation.author = req.body.author.trim();
    }
    citation.save(function (err) {
      if (err) {
        next(err);
      }
      else {
        res.redirect('/about/');
      }
    });
  });
});


module.exports = router;
