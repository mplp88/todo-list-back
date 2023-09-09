const express = require('express');
const router = express.Router();
const db = require('./firestore');

router.get('/', async (req, res) => {
  try {
    let todos = [];
    let snapshot = await db.collection('todos').get();
    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        todos.push({
          id: doc.id,
          ...doc.data()
        });
      })
    }

    return res.json({
      todos
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let doc = await db.collection('todos').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        message: `To Do with id ${id} doesn't exist!`
      })
    }

    let todo = {
      id: doc.id,
      ...doc.data()
    }

    return res.json({
      todo
    });
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e
    })
  }
})

router.post('/', async (req, res) => {
  try {

    let description = req.body.description;

    if (description == '') {
      return res.status(400).json({
        message: 'Description cannot be empty'
      });
    }

    let todo = {
      description,
      done: false
    }

    inserted = await db.collection('todos').add(todo);
    todo.id = inserted.id

    return res.json({
      todo
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e
    })
  }
});

router.put('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let description = req.body.description;
    let done = req.body.done;
    let docRef = db.collection('todos').doc(id);
    let doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: `To Do with id ${id} doesn't exist!`
      })
    }

    await docRef.set({
      description,
      done
    })

    doc = await docRef.get();

    let todo = {
      id: doc.id,
      ...doc.data()
    }
    return res.json({
      todo
    });
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e
    })
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let docRef = await db.collection('todos').doc(id)
    let doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        message: `To Do with id ${id} doesn't exist!`
      })
    }
    await docRef.delete();

    return res.json({
      message: 'Deleted successfully!'
    });
  } catch (e) {
    return res.status(500).json({
      message: 'Internal server error',
      error: e
    })
  }
})

module.exports = router;