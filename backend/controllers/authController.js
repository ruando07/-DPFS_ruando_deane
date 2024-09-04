const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('.../models/User'); 


exports.register = async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

      
        user = new User({
            name,
            email,
            password
        });

   
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

       
        await user.save();

      
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};


exports.login = async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

       
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};


exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};
