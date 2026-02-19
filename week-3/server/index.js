const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Course = require('./models/course');
const Professor = require('./models/professor');

mongoose.connect('mongodb://127.0.0.1:27017/utnapi');
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});


const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: '*'
}));


//routes
app.post('/course', async (req, res) => {
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        id_professor: req.body.id_professor,
        credits: req.body.credits
    })

    try {
        const courseCreated = await course.save();
        
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/course', async (req, res) => {
    try{
        
        if(!req.query.id){
            const data = await Course.find();
            return res.status(200).json(data)
        }
        const data = await Course.findById(req.query.id);
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


// actualizar un curso por id pasado como query param ?id=
app.put('/course', async (req, res) => {
    try {
        const id = req.query.id;
        if(!id) return res.status(400).json({message: 'id query param required'});

        const updated = await Course.findByIdAndUpdate(id, {
            name: req.body.name,
            credits: req.body.credits
        }, { new: true, runValidators: true });

        if(!updated) return res.status(404);
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

// eliminar un curso por id pasado como query param ?id=
app.delete('/course', async (req, res) => {
    try {
        const id = req.query.id;
        if(!id) return res.status(400).json({message: 'id query param required'});

        const deleted = await Course.findByIdAndDelete(id);
        if(!deleted) return res.status(404);
        // no tiene 
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({message: error.message})
    }
});

//professor routes -cambiar nombre al index.js

app.get('/professor', async (req, res) => {
  try {
    const list = await Professor.find().lean();
    return res.status(200).json(list)
  } catch (error) {
    
    return res.status(500)
  }
});

app.post('/professor', async (req, res) => {
  
    const professor = new Professor({
      name: req.body.name,
      lastname: req.body.lastname,
      id_c: req.body.id_c,
      age: req.body.age
    });

    try {
    const professorCreate = await professor.save();
    res.header('Location', `/professor?id=${professorCreate._id}`);
    return res.status(201).json(professorCreate)
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
});

app.put('/professor', async (req, res) => { 
    try {
        const id = req.query.id;
        if(!id) return res.status(400).json({message: 'id query param required'})
    const updated = await Professor.findByIdAndUpdate(id, {
        name: req.body.name,
        lastname: req.body.lastname,
        age: req.body.age
    }, { new: true, runValidators: true });
    if(!updated) return res.status(404);
    return res.status(200).json(updated)
    } catch (error) {
      return res.status(400)
    }

});
 app.delete('/professor', async (req, res) => {
      try {
          const id = req.query.id;
            if(!id) return res.status(400).json({message: 'id query param required'})
            const deleted = await Professor.findByIdAndDelete(id);
            if(!deleted) return res.status(404);
            return res.status(204).send();
      } catch (error) {
        return res.status(500)
      } 
});



//iniciar la app
app.listen(3001, () => console.log(`UTN API service listening on port 3001!`))
