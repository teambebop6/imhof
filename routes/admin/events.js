var express, router, Event;

express = require('express');
router = express.Router();

var moment = require('moment');
//moment.locale("de");

utils = require('../../utils/AdminUtils');

Event = require('../../models/event');

// List events
router.get('/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Event.find(function (err, events) {
    if (err) {
      next(err)
    }
    else {
      return res.render('admin/events/index', {
        active: {events: true},
        events: events,
        moment: moment
      });
    }
  });
});

// Save event
saveEvent = function (req, res, next, event) {
  event.save(function (err) {
    if (err) {
      next(err);
    }
    else {
      res.redirect('/admin/events/');
    }
  });
}

router.post('/modify', function (req, res, next) {
  if (req.body.id) {
    // Update existing event
    Event.findOne({_id: req.body.id}, function (err, event) {
      if (err) {
        return next(err)
      }
      if (!event) {
        return next({status: 400, message: "User not found."})
      }
      else {
        event.name = req.body.name;
        event.begin = req.body.begin;
        event.end = req.body.end;

        saveEvent(req, res, next, event);
      }
    });
  } else {

    console.log("Req body is:");
    console.log(req.body);

    // New Event
    event = new Event({
      name: req.body.name,
      begin: req.body.begin,
      end: req.body.end,
    });

    console.log("Creating new event: " + JSON.stringify(event));
    saveEvent(req, res, next, event);
  }
});


router.get('/new', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  return res.render('admin/events/modify', {
    active: {events: true},
    event: {}
  });
});

router.get('/modify/:id', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  Event.findOne({_id: req.params.id}, function (err, event) {
    if (err) {
      next(err)
    }
    if (!event) {
      next({status: 400, message: "Event not found!"});
    } else {
      return res.render('admin/events/modify', {
        active: {events: true},
        event: event,
      });
    }
  });
});

router.post('/delete/', utils.isNotAuthenticatedThenLogin, function (req, res, next) {
  console.log(req.body.id)
  Event.findOne({_id: req.body.id}, function (err, event) {
    if (err) {
      return res.json(err)
    }
    if (!event) {
      return res.json({status: 400, message: "Event not found."})
    }
    else {
      event.remove(function (err) {
        if (err) {
          res.json(err)
        }
        else {
          res.json({
            status: 200,
            message: "Successfully deleted event."
          });
        }
      });
    }
  });
});

module.exports = router;
