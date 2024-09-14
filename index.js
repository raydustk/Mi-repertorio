const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.get('/canciones', (req, res) => {
    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the song list' });
        }
        const canciones = JSON.parse(data);
        res.json(canciones);
    });
});

app.post('/canciones', (req, res) => {
    const newSong = req.body;
    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the song list' });
        }
        const canciones = JSON.parse(data);
        canciones.push(newSong);

        fs.writeFile('./repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving the new song' });
            }
            res.json({ message: 'Song added successfully!' });
        });
    });
});


app.put('/canciones/:id', (req, res) => {
    const songId = parseInt(req.params.id);
    const updatedSong = req.body;
    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the song list' });
        }
        let canciones = JSON.parse(data);
        const songIndex = canciones.findIndex(song => song.id === songId);
        if (songIndex === -1) {
            return res.status(404).json({ message: 'Song not found' });
        }
        canciones[songIndex] = updatedSong;

        fs.writeFile('./repertorio.json', JSON.stringify(canciones, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating the song' });
            }
            res.json({ message: 'Song updated successfully!' });
        });
    });
});


app.delete('/canciones/:id', (req, res) => {
    const songId = parseInt(req.params.id);
    fs.readFile('./repertorio.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the song list' });
        }
        let canciones = JSON.parse(data);
        const newCanciones = canciones.filter(song => song.id !== songId);

        fs.writeFile('./repertorio.json', JSON.stringify(newCanciones, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting the song' });
            }
            res.json({ message: 'Song deleted successfully!' });
        });
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
