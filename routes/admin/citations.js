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

// List citations
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Citation.find().sort({visible: 'desc', last_modified_date: 'desc'}).exec(function (err, citations) {
    if (err) {
      next(err)
    }
    else {
      return res.render('admin/citations/index', {
        active: {citations: true},
        citations: citations,
        moment: moment
      });
    }
  });

});

router.get('/modify/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Citation.findOne({_id: req.params.id}, function (err, citation) {
    if (err) {
      next(err)
    }
    if (!citation) {
      next({status: 400, message: "Citation not found!"});
    } else {
      return res.render('admin/citations/modify', {
        active: {citations: true},
        citation: citation,
      });
    }
  });
});

router.get('/preview/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Citation.findOne({_id: req.params.id}, function (err, citation) {
    if (err) {
      next(err)
    }
    else {
      return res.render('admin/citations/preview', {
        active: {citations: true},
        citation: citation,
        moment: moment
      });
    }
  });

});

router.get('/new', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  return res.render('admin/citations/modify', {
    active: {citations: true},
    citation: {}
  });
});

saveCitation = function (req, res, next, citation) {
  citation.save(function (err) {
    if (err) {
      next(err);
    }
    else {
      res.redirect('/admin/citations/');
    }
  });
};

router.post('/modify', function (req, res, next) {
  if (req.body.id) {
    // Update existing citation
    Citation.findOne({_id: req.body.id}, function (err, citation) {
      if (err) {
        return next(err)
      }
      if (!citation) {
        return next({status: 400, message: "Citation not found."})
      } else {
        citation.words = req.body.words.trim();
        citation.author = req.body.author.trim();
        saveCitation(req, res, next, citation);
      }
    });
  } else {
    console.log("Req body is:");
    console.log(req.body);
    var citation = new Citation({
      words: req.body.words.trim(),
      author: req.body.author.trim(),
    });
    saveCitation(req, res, next, citation);
  }
});

router.post('/visible', function (req, res, next) {

  var id = req.body.id;
  var visible = req.body.visible;

  if (id) {
    // Update existing Citation
    Citation.findOne({_id: id}, function (err, citation) {
      if (err) {
        return next(err)
      }
      if (!citation) {
        return next({status: 400, message: "Citation not found."})
      } else {
        citation.visible = visible;
        saveCitation(req, res, next, citation);
      }
    });
  } else {
    return res.json({status: 400, message: "Citation not found."})
  }
});

module.exports = router;
